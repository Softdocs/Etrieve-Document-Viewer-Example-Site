import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import concatCss from 'gulp-concat-css';

import project from '../aurelia.json';
import {build} from 'aurelia-cli';

function processCSS() {
  return gulp.src(project.cssProcessor.source)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(build.bundle());
}

function processSASS() {
  return gulp.src(project.cssProcessor.preCompiled)
      //  .pipe(sourcemaps.init())
      .pipe(sass({
          outputStyle: 'compressed'
      }).on('error', sass.logError))
      //  .pipe(sourcemaps.write())
      .pipe(concatCss('styles.css'))
      .pipe(gulp.dest('./wwwroot'));
}

export default gulp.series(
  processCSS,
  processSASS
);
