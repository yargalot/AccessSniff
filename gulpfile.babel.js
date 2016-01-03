import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';

gulp.task('default', ['lint', 'babel', 'babel:watch']);

gulp.task('lint', function () {
  return gulp.src(['./src/*.js','!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('babel', () => {
  return gulp.src('./src/index.js')
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('babel:watch', () => gulp.watch('./src/**/*.js', ['lint', 'babel']));
