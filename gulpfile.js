let gulp = require('gulp');
let cleanCSS = require('gulp-cleaner-css');
let htmlmin = require('gulp-htmlmin-next');
let htmlclean = require('gulp-htmlclean');

let export_directory = "../build/"

gulp.task('minify-css', function() {
    return gulp.src(export_directory + '**/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest(export_directory))
});


gulp.task('minify-html', function() {
  return gulp.src(export_directory + '**/*.htm')
    .pipe(htmlclean())
    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
    }))
    .pipe(gulp.dest(export_directory))
});

gulp.task('default', gulp.parallel('minify-html', 'minify-css'));