var gulp = require('gulp');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

gulp.task('watch', function() {
  var bundler = watchify('./js/app.js');
  bundler.on('update', rebundle);

  function rebundle() {
    console.log('Bundling JS code at ' + new Date().toString());
    return bundler.bundle({debug: true})
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('.'));
  }

  return rebundle();
});

gulp.task('default', ['watch']);
