const Q = require('q');
const path = require('path');
const os = require('os');
const Utils = require('./utils');
const AdmZip = require('adm-zip');

class Zipper {
  static zip(options = {}) {
    const extendedOptions = Object.assign({}, options);

    extendedOptions.name = path.basename(extendedOptions.dest);
    extendedOptions.src = extendedOptions.absolute ? extendedOptions.src : getPath(extendedOptions.src);
    extendedOptions.dest = extendedOptions.absolute ? path.dirname(extendedOptions.dest) : path.dirname(getPath(extendedOptions.dest));

    return Utils
      .exists(path.join(extendedOptions.dest, extendedOptions.name))
      .then((exists) => {
        if (exists) {
          return Q.reject(new Error('The file already exists in the destination path'));
        }
        if (isWindowsPlatform()) {
          return Utils.runGulpZipping(extendedOptions);
        }
        return Utils.runNativeZipping(extendedOptions);
      });
  }

  static unzip(options = {}) {
    const extendedOptions = Object.assign({}, options);
    extendedOptions.src = extendedOptions.absolute ? extendedOptions.src : getPath(extendedOptions.src);
    extendedOptions.dest = extendedOptions.absolute ? extendedOptions.dest : getPath(extendedOptions.dest);

    if (isWindowsPlatform()) {
      return Utils.runAdmUnzipping(extendedOptions);
    }
    return Utils.runNativeUnzipping(extendedOptions);
  }

  static getFileContent(options = {}) {
    const deferred = Q.defer();
    const extendedOptions = Object.assign({}, options);

    extendedOptions.src = extendedOptions.absolute ? extendedOptions.src : getPath(extendedOptions.src);

    const zip = new AdmZip(extendedOptions.src);

    zip.readAsTextAsync(extendedOptions.filePath, (data) => {
      deferred.resolve(data);
    });

    return deferred.promise;
  }
}

module.exports = Zipper;

function getPath(src) {
  return path.normalize(process.cwd() + path.sep + src);
}

function isWindowsPlatform() {
  return os.platform() === 'win32';
}
