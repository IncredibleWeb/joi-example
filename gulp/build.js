'use strict';

import gulp from 'gulp';
import runSeq from 'run-sequence';
import babel from 'gulp-babel';
import rename from 'gulp-rename';

gulp.task('build', (done) => {
    return runSeq(['lint_js', 'scripts'], 'compile', done);
});

// build JS for distribution
gulp.task('build_js', ['scripts_dist', 'lint_js']);

gulp.task('compile', ['build_server', 'build_app', 'build_html']);

// babel app file
gulp.task('build_app', () => {
    return gulp.src('./app.babel.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('./'));
});

// babel server files
gulp.task('build_server', () => {
    return gulp.src(global.paths.serverJs)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(global.paths.serverDist));
});

// build HTML for distribution
gulp.task('build_html', () => {
    return gulp.src(global.paths.html)
        .pipe(gulp.dest(global.paths.serverDist));
});