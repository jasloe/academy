var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var shell = require('gulp-shell');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var fs = require("fs");
var runSequence = require('run-sequence');
var config = require("./config.js");

/**
 * If config.js exists, load that config for overriding certain values below.
 */
function loadConfig() {
  if (fs.existsSync(__dirname + "./config.js")) {
    config = {};
    config = require("./config");
  }

  return config;
}

loadConfig();

/**
 * This task generates CSS from all SCSS files and compresses them down.
 */
gulp.task('sass', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      noCache: true,
      outputStyle: 'expanded',
      lineNumbers: true,
      loadPath: './css/*',
      sourceMap: true
    })).on('error', function (error) {
      gutil.log(error);
      this.emit('end');
    })
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./css'))
    .pipe(notify({
      title: "SASS Compiled",
      message: "All SASS files have been recompiled to CSS.",
      onLast: true
    }));
});

/**
 * This task minifies javascript in the js/js-src folder and places them in the js directory.
 */
gulp.task('compress', function () {
  return gulp.src('./src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(notify({
      title: "JS Minified",
      message: "All JS files in the theme have been minified.",
      onLast: true
    }));
});

/**
 * Defines a task that triggers a Drush cache clear (css-js).
 */
gulp.task('drush:cc', function () {
  if (!config.drush.enabled) {
    return;
  }

  return gulp.src('', {
      read: false
    })
    .pipe(shell([
      config.drush.alias.css_js
    ]))
    .pipe(notify({
      title: "Caches cleared",
      message: "Drupal CSS/JS caches cleared.",
      onLast: true
    }));
});

/**
 * Defines a task that triggers a Drush cache rebuild.
 */
gulp.task('drush:cr', function () {
  if (!config.drush.enabled) {
    return;
  }

  return gulp.src('', {
      read: false
    })
    .pipe(shell([
      config.drush.alias.cr
    ]))
    .pipe(notify({
      title: "Cache rebuilt",
      message: "Drupal cache rebuilt.",
      onLast: true
    }));
});


gulp.task('browser-sync', function () {
  browserSync.init({
    files: ['css/**/*.css', 'dist/js/*.js'],
    port: config.browserSync.port,
    proxy: config.browserSync.hostname,
    open: config.browserSync.openAutomatically,
    reloadDelay: config.browserSync.reloadDelay,
    injectChanges: config.browserSync.injectChanges
  });
});

gulp.task('reload', function () {
  browserSync.reload();
});

gulp.task('flush', function () {
  runSequence('drush:cr', 'reload');
});

gulp.task('watch', function () {
  gulp.watch(['scss/**/*.scss'], ['sass', 'drush:cc']);
  gulp.watch(['src/js/*.js', 'src/js/**/*.js'], ['compress', 'drush:cc']);

  if (!config.twig.useCache) {
    gulp.watch(['templates/**/*.html.twig'], ['flush']);
  }
});

gulp.task('default', ['watch', 'browser-sync']);
