import { join, basename, dirname, normalize, sep } from 'path';
import { platform } from 'os';
import AdmZip from 'adm-zip';
import * as tar from 'tar';
import { Utils } from './utils';
import { IGetFileContentOptions, ITarOptions, IUnzipOptions, IZipOptions } from './interfaces';

export class Zipper {

  static async tar(options: ITarOptions): Promise<void> {
    const extendedOptions = Object.assign({}, options);

    return new Promise<void>((resolve, reject) => {
      tar
        .create({ gzip: true, file: extendedOptions.dest }, extendedOptions.fileList)
        .then(resolve)
        .catch(reject);
    });
  }

  static async zip (options: IZipOptions) {
    const extendedOptions = Object.assign({}, options);

    extendedOptions.name = basename(extendedOptions.dest);
    extendedOptions.src = extendedOptions.absolute ? extendedOptions.src : getPath(extendedOptions.src);
    extendedOptions.dest = extendedOptions.absolute ? dirname(extendedOptions.dest) : dirname(getPath(extendedOptions.dest));

    const exists = await Utils.exists(join(extendedOptions.dest, extendedOptions.name));

    if (exists) {
      throw new Error('The file already exists in the destination path');
    }
    if (isWindowsPlatform()) {
      return await Utils.runGulpZipping(extendedOptions);
    }
    return await Utils.runNativeZipping(extendedOptions);

  }

  static async unzip (options: IUnzipOptions) {
    const extendedOptions = Object.assign({}, options);
    extendedOptions.src = extendedOptions.absolute ? extendedOptions.src : getPath(extendedOptions.src);
    extendedOptions.dest = extendedOptions.absolute ? extendedOptions.dest : getPath(extendedOptions.dest);

    if (isWindowsPlatform()) {
      return await Utils.runAdmUnzipping(extendedOptions);
    }
    return await Utils.runAdmUnzipping(extendedOptions);
  }

  static getFileContent (options: IGetFileContentOptions) {
    const extendedOptions = Object.assign({}, options);

    extendedOptions.src = extendedOptions.absolute ? extendedOptions.src : getPath(extendedOptions.src);

    const zip = new AdmZip(extendedOptions.src);

    return new Promise((resolve, reject) => { // todo: promisify
      zip.readAsTextAsync(extendedOptions.filePath, (data) => {
        resolve(data);
      });
    });

  }
}

function getPath(src: string) {
  return normalize(process.cwd() + sep + src);
}

function isWindowsPlatform() {
  return platform() === 'win32';
}
