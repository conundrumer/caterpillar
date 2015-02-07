// Include gulp
var gulp = require('gulp');

// Include Our Plugins
// var sass = require('gulp-ruby-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
// var reactify = require('reactify');

// Compass & Compile our Sass
// gulp.task('sass', function() {
//     var path = './public/stylesheets/';
//     var files = [
//         path + 'sass/*.scss',
//         path + 'sass/grid/*.scss'
//     ]
//     return gulp.src(files)
//         .pipe(sass({
//             compass: true,
//             // bundleExec: true,
//             // sourcemap: true,
//             sourcemapPath: '../sass',
//             style: 'compressed'
//         }))
//         .on('error', function(err) {
//             console.log(err.message);
//         })
//         .pipe(gulp.dest('./public/stylesheets/css/'));
// });

// Watch Files For Changes
// gulp.task('watch', function() {
//     gulp.watch('./public/stylesheets/sass/*.scss', ['sass']);
// });

// Browserify
gulp.task('browserify', function() {
    var path = './public/js/src/';
    var files = [
        path + 'script.js'
    ];
    var bundler = browserify(files, watchify.args);

    var bundle = function() {
        return bundler.bundle()
            .on('error', function(err) {
                console.log(err.message);
                this.end();
            })
            //Pass desired output filename to vinyl-source-stream
            .pipe(source('bundle.js'))
            //Start piping stream to tasks
            .pipe(gulp.dest('./public/js/build/'));
    };

    bundler = watchify(bundler);
    // bundler.transform(reactify);
    bundler.on('update', bundle);

    return bundle();
});

// Default Task
// gulp.task('default', ['browserify', 'sass', 'watch']);
gulp.task('default', ['browserify']);
