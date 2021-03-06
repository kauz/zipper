import { spawn, exec } from 'child_process';
import { join } from 'path';
import { stat, Stats } from 'fs';
import { promisify } from 'util';
import { IOptions } from './interfaces';

export class Utils {
  private static stat = promisify(stat);
  private static exec = promisify(exec);

  static runNativeZipping(options: IOptions): Promise<void> {
    const processParams = ['../scripts/zip.sh', options.src, options.dest, options.name];

    if (options.compression !== undefined) {
      processParams.push(options.compression);
    }

    const process = spawn('sh', processParams, { cwd: __dirname });

    return new Promise((resolve, reject) => {
      process.stdout.on('data', () => {});

      process.stderr.on('data', (data) => {
        console.log('err', data.toString());
        reject(data);
      });

      process.on('close', (code, signal) => {
        console.log('zipping code', code, signal);
        if (!code) {
          resolve();
        } else {
          reject(new Error(`Code: ${code}`));
        }
      });

    });
  }

  static async runGulpZipping(options: IOptions): Promise<{stdout: string, stderr: string}> {
    return await Utils.exec(`gulp zip --src ${options.src} --dest ${options.dest} --name ${options.name}`, {
      cwd: join(__dirname, '../scripts'),
    });
  }

  static runNativeUnzipping(options: IOptions): Promise<void> {
    console.time('native');
    console.log(__dirname);
    const process = spawn('sh', ['../scripts/unzip.sh', options.src, options.dest], { cwd: __dirname });

    return new Promise((resolve, reject) => {
      process.stdout.on('data', () => {});

      process.stderr.on('data', async (data) => {
        console.log('err', data.toString());
        reject(data);
      });

      process.on('close', (code, signal) => {
        console.timeEnd('native');
        console.log('unzipping code', code, signal);
        if (!code) {
          resolve();
        } else {
          reject(new Error(`Code: ${code}`));
        }
      });

    });
  }

  static async runAdmUnzipping(options: IOptions): Promise<{stdout: string, stderr: string}> {
    console.time('adm');
    const stdout = await Utils.exec(`node unzip --src ${options.src} --dest ${options.dest} --overwrite ${options.overwrite || false }`, {
      cwd: join(__dirname, '../scripts'),
    });
    console.timeEnd('adm');
    return stdout;
  }

  static async exists(filePath: string): Promise<boolean> {
    try {
      await Utils.stat(filePath);
      return true;
    } catch (e) {
      return false;
    }
  }
}
