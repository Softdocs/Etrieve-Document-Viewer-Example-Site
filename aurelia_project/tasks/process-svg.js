import gulp from 'gulp';
import project from '../aurelia.json';
import through from 'through2';
import {build} from 'aurelia-cli';

export default function processSVG() {
    return gulp.src(project.svgProcessor.source)
    .pipe(through.obj((file, enc, cb) => {
        file.extname = '.html';
        file.contents = new Buffer(`<template>\n${file.contents.toString()}\n</template>`, enc);
        cb(null, file);
    }))
    // .pipe(gulp.dest(project.platform.output));
    .pipe(build.bundle());
}
