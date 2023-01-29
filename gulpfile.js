import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import terser from 'gulp-terser';
import htmlmin from 'gulp-htmlmin';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgo';
import clean from 'gulp-clean'


// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

 const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}

// SCRIPTS

const scripts = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream());
}

// IMAGES

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg,jpeg}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'));
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{png,jpg,jpeg}')
    .pipe(gulp.dest('build/img'));
}

// WEBP

const createWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg,jpeg}')
  .pipe(squoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'))
}

// SVG

 const svg = () => {
  return gulp.src(['source/img/*.svg', '!source/img/icons*.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));
}

// COPY

 const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

// CLEAN

export const del = () => {
  return gulp.src('build', { read: false, allowEmpty: true })
    .pipe(clean());
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

// Build

export const build = gulp.series(
  del,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    createWebp
  ),
  );

// Default

export default gulp.series(
  del,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
