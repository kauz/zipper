const AdmZip = require('adm-zip');
const optimist = require('optimist').argv;

const zip = new AdmZip(optimist.src);
zip.extractAllTo(optimist.dest, optimist.overwrite);
