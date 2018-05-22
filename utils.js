const Q = require('q');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class Utils {
  static runNativeZipping(options = {}) {
    const deferred = Q.defer();
    const processParams = ['scripts/zip.sh', options.src, options.dest, options.name];
    if (options.compression !== undefined) {
      processParams.push(options.compression);
    }
    let error;

    const process = spawn('sh', processParams, { cwd: __dirname });

    process.stdout.on('data', () => {});
    process.stderr.on('data', (data) => {
      console.log('err', data.toString());
      error += `\n${data.toString()}`;
    });

    process.on('close', (code, signal) => {
      console.log('zipping code', code, signal);
      if (!code) {
        deferred.resolve();
      } else {
        deferred.reject(error);
      }
    });

    return deferred.promise;
  }

  static runGulpZipping(options = {}) {
    const deferred = Q.defer();
    const gulpExec = exec(`gulp zip --src ${options.src} --dest ${options.dest} --name ${options.name} --ignore "${options.ignore}"`, {
      cwd: path.join(__dirname, 'scripts'),
    });
    let error = '';

    gulpExec.stderr.on('data', (data) => {
      error += `\n${data.toString()}`;
    });

    gulpExec.on('close', (code) => {
      if (!code) {
        deferred.resolve();
      } else {
        deferred.reject(error);
      }
    });
    return deferred.promise;
  }

  static runNativeUnzipping(options) {
    const deferred = Q.defer();
    let error;
    console.time('native');
    const process = spawn('sh', ['scripts/unzip.sh', options.src, options.dest], { cwd: __dirname });

    process.stdout.on('data', () => {});
    process.stderr.on('data', (data) => {
      console.log('err', data.toString());
      error += `\n${data.toString()}`;
    });

    process.on('close', (code, signal) => {
      console.timeEnd('native');
      console.log('unzipping code', code, signal);
      if (!code) {
        deferred.resolve();
      } else {
        deferred.reject(error);
      }
    });

    return deferred.promise;
  }

  static runAdmUnzipping(options = {}) {
    const deferred = Q.defer();
    console.time('adm');
    exec(`node unzip --src ${options.src} --dest ${options.dest} --overwrite ${options.overwrite || false}`, {
      cwd: path.join(__dirname, 'scripts'),
    }, (err, stdout) => {
      console.timeEnd('adm');
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(stdout);
      }
    });

    return deferred.promise;
  }

  static exists(filePath) {
    return stat(filePath)
      .then(() => true)
      .catch(() => false);
  }
}

module.exports = Utils;

function stat(filePath) {
  const deferred = Q.defer();
  fs.stat(filePath, promiseResult(deferred));
  return deferred.promise;
}

function promiseResult(deferred) {
  return (err, data) => {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data);
    }
  };
}
