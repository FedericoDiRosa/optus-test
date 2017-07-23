const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const browserSync = require('browser-sync').create();

const sassPaths = [
  'node_modules/foundation-sites/scss',
];

gulp.task('sass', () => {
  return gulp.src('src/scss/app.scss')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({ includePaths: sassPaths, outputStyle: 'compressed' }).on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer({ browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3'] }))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('eslint', () => {
  return gulp.src('src/js/app.js')
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('js', ['eslint'], () => {
  return browserify({ entries: 'src/js/app.js', debug: true })
    .transform('babelify', { presets: ['es2015'] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('test', () => {
  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(plugins.mocha({ reporter: 'spec', compilers: 'js:babel-core/register' }));
});

// Run server and watch files
gulp.task('serve', ['sass', 'js'], () => {
  browserSync.init({ server: './dist', port: 8080 });
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('dist/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
