const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const connect = require('gulp-connect');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const order = require('gulp-order');

const jsSources = ['js/*.js'];
const sassSources = ['sass/*.scss'];
const htmlSources = ['**/*.html'];
const outputCSSDir = 'css';
const outputJSDir = 'js'; // Adjusted to use dist/js as the output directory for JavaScript files
const outputDir = 'dist';

function compileSass() {
  return gulp.src(sassSources)
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(gulp.dest(outputDir))
    .pipe(connect.reload());
}

function processJS() {
  return gulp.src(jsSources)
    .pipe(order([
      'js/jquery.min.js',
      'js/jquery.easing.1.3.js',
      'js/bootstrap.min.js',
      'js/jquery.waypoints.min.js',
      'js/sticky.js',
      'js/jquery.stellar.min.js',
      'js/hoverIntent.js',
      'js/superfish.js',
      'js/jquery.magnific-popup.min.js',
      'js/magnific-popup-options.js',
      'js/google_map.js',
      'js/main.js'
    ], { base: './' }))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(outputDir))
    .pipe(uglify({ mangle: false }))
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest(outputDir))
    .pipe(connect.reload());
}

function watchFiles() {
  gulp.watch(jsSources, processJS);
  gulp.watch(sassSources, compileSass);
  gulp.watch(htmlSources, reloadHTML);
}

function serve() {
  connect.server({
    root: '.',
    livereload: true
  });
}

function reloadHTML() {
  return gulp.src(htmlSources)
    .pipe(connect.reload());
}

// Define complex tasks
const watch = gulp.parallel(watchFiles, serve);
const build = gulp.parallel(compileSass, processJS);

// Export tasks to public API
exports.sass = compileSass;
exports.js = processJS;
exports.html = reloadHTML;
exports.watch = watch;
exports.default = gulp.series(build, watch);
