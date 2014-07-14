var gulp = require('gulp');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

var ENTRY_POINT = './js/app.js';

gulp.task('watch', function() {
  var bundler = watchify(ENTRY_POINT);
  bundler.on('update', rebundle);

  function rebundle() {
    console.log('Bundling JS code at ' + new Date().toString());
    return bundler.bundle({debug: true})
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('.'));
  }

  return rebundle();
});

gulp.task('build-prod', function() {
  return (watchify.browserify(ENTRY_POINT)
    .bundle()
    .pipe(source('bundle.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('.')));
});

gulp.task('default', ['watch']);
