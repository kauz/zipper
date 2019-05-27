const AdmZip = require('adm-zip');
const program = require('commander');

program.version('1.0.0')
    .option('-s, --src [file name]', 'Source file name')
    .option('-d, --dest [dir name]', 'Destination directory name')
    .option('-w, --overwrite [boolean]', 'Overwrite dest file if exists')
    .parse(process.argv);

const zip = new AdmZip(program.src);
zip.extractAllTo(program.dest);
