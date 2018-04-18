var gulp = require('gulp');  
var nodemon = require('gulp-nodemon');  
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
    return gulp.src('./public/styles/scss/*.scss',{sourcemap: true})
        .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write('maps', {
        includeContent: false,
        sourceRoot: 'source'
    }))
      .pipe(gulp.dest('./public/styles/css/'))
      .pipe(browserSync.stream());
  });

gulp.task('scripts', function() {  
  return gulp.src('./public/scripts/controllers/*.js')
});

gulp.task('html',function(){  
    return gulp.src('./public/views/*.html')
});

gulp.task('watch', function() {  
    browserSync.init({
        proxy: "http://localhost:3000",
        port: 7000,
    });
    gulp.watch('./public/styles/scss/*.scss', ['sass']);
    gulp.watch('./public/scripts/*.js', ['scripts']).on('change', browserSync.reload);;
    gulp.watch('./public/views/*.html', ['html']).on('change', browserSync.reload);;
});

gulp.task('server',function(){  
    nodemon({
        'script': 'index.js',
    });
});

gulp.task('serve', ['server','watch']);  