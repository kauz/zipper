const gulp = require('gulp');
const zip = require('gulp-zip');
const util = require('gulp-util');

gulp.task('zip', () => gulp.src(`${util.env.src}/*`, { dot: true })
  .pipe(zip(util.env.name))
  .pipe(gulp.dest(util.env.dest)));
