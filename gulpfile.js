var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var coffee = require('gulp-coffee');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var debug = require('gulp-debug');
var sh = require('shelljs');

var paths = {
    sass: ['./scss/**/*.scss'],
    coffee: [
        './www/coffee/base/*.coffee',
        './www/coffee/base/*/*.coffee',
        './www/coffee/*/*.coffee',
        './www/coffee/*/*/**/*.coffee'
    ],
};

var dist = {
  js: './www/js/'
};

var tempDir = './tmp/';

gulp.task('default', ['sass', 'coffee']);

gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(debug({title: 'SASS Files'}))
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('coffee', function () {
    gulp.src(paths.coffee)
        .pipe(debug({title: 'Coffee Files'}))
        .pipe(sourcemaps.init())
        .pipe(coffee())
        .pipe(gulp.dest(tempDir + '/js'))
        .pipe(concat('narwhal.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dist.js))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest(dist.js));
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.coffee, ['coffee']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
