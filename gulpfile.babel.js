import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';

gulp.task('lint', () =>
  gulp.src(['./src/*.js','!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  );

gulp.task('babel', () =>
  gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .on('error', console.error.bind(console))
    .pipe(gulp.dest('dist'))
);

gulp.task('babel:watch', () => gulp.watch('./src/**/*.js', ['lint', 'babel']));

// Actual tasks
gulp.task('test', ['lint']);
gulp.task('default', ['lint', 'babel', 'babel:watch']);
