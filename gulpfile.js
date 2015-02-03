var gulp = require('gulp'),
    browserify = require('browserify'),
    transform = require('vinyl-transform'),
    uglify = require('gulp-uglify'),
    stylus = require('gulp-stylus'),
    minifyHTML = require('gulp-minify-html'),
    nib = require('nib'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    src = './views',
    dest = './build'

gulp.task('browserify', function(){
  
  var browserified = transform(function(filename){
    var b = browserify(filename)
    return b.bundle()
  })
  
  return gulp.src( [ src + '/**/*.js'], {base: src})
  .pipe( browserified )  
//  .pipe( uglify() )
  .pipe( gulp.dest( dest ) )
  
})

gulp.task('html', function() {
  
  return gulp.src( [ src +'/**/*.html'], {base: src})
  .pipe( minifyHTML() )
  .pipe( gulp.dest( dest ) )
  
})

gulp.task('styles', function() {
  return gulp.src( [ src + '/**/*.styl'], {base: src})
  .pipe( sourcemaps.init() )
  .pipe( stylus() )
  .pipe( sourcemaps.write() )
  .pipe( gulp.dest( dest ) )
})

gulp.task('browser-sync', function () {
  browserSync({
    proxy: 'localhost:3000',
    files: [ dest + '/**/*.{js,css,html}']
  })
})

gulp.task('default', ['browserify', 'html', 'styles', 'browser-sync'], function() {
  
  gulp.watch( src + '/**/*.js', ['browserify', browserSync.reload])
  
  gulp.watch( src + '/**/*.html', ['html'], browserSync.reload)
  
  gulp.watch( src + '/**/*.styl', ['styles'], browserSync.reload)
  
})