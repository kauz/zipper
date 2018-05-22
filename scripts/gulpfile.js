const gulp = require('gulp');
const zip = require('gulp-zip');
const util = require('gulp-util');

function getSrc(src, ignore) {
  const ignoreFiles = ignore.split(' ').map(part => `!${src}/${part}`);
  return [`${src}/**`].concat(ignoreFiles);
}

gulp.task('zip', () => gulp.src(getSrc(util.env.src, util.env.ignore), { dot: true })
  .pipe(zip(util.env.name))
  .pipe(gulp.dest(util.env.dest)));
