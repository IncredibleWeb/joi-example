'use strict';

import gulp from 'gulp';
import path from 'path';
import util from 'gulp-util';
import nodemon from 'gulp-nodemon';
import runSeq from 'run-sequence';

function logChanges(event) {
    util.log(
        util.colors.green('File ' + event.type + ': ') +
        util.colors.magenta(path.basename(event.path))
    );
}

// Watch for changes.
gulp.task('watch', ['build'], () => {
    gulp.watch([global.paths.js], ['lint_js', 'scripts']).on('change', logChanges);
    gulp.watch([global.paths.html], ['build_html']).on('change', logChanges);

    let stream = nodemon({
        exec: 'node --inspect',
        script: './app.js',
        args: ['debug'],
        ext: 'js css html',
        watch: ['./server/'],
        tasks: (changedFiles) => {
            var tasks = [];
            if (changedFiles) {
                changedFiles.forEach(function(file) {
                    let folders = path.parse(path.dirname(file)).dir.toLowerCase();
                    folders = folders.replace(process.cwd().toLowerCase(), '');
                    if (/^win/.test(process.platform)) {
                        folders = folders.replace(/\\/g, '/');
                    }
                    folders = folders + '/';
                    if (path.extname(file) === '.html' && !~tasks.indexOf('build_html')) { tasks.push('build_html'); };
                    if (path.extname(file) === '.js' && /^\/server\//.test(folders) && !~tasks.indexOf('build_server')) { tasks.push('build_server'); };
                });
            }
            return tasks;
        }
    });

    // restart the server if crashes
    stream.on('crash', function() {
        stream.emit('restart', 3);
    });

    // manual restarting of nodemon
    gulp.watch(['./app.babel.js'], () => {
        return runSeq('build_app', () => {
            stream.emit('restart');
        });
    }).on('change', logChanges);
});
