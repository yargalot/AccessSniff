import del from 'del';
import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import nodeunit from 'gulp-nodeunit';
import istanbul from 'gulp-istanbul';

const srcFolder = './src';
const distFolder = './dist';
const HTMLCSFolder = './node_modules/html_codesniffer';


gulp.task('clean', () =>
  del(['dist', 'reports', 'test/*.xml']));

gulp.task('lint', () =>
  gulp
    .src([
      `${srcFolder}/*.js`,
      '!node_modules/**'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('babel', () =>
  gulp
    .src(`${srcFolder}/**/*.js`)
    .pipe(babel({
      presets: ['es2015']
    }))
    // eslint-disable-next-line
    .on('error', console.error.bind(console))
    .pipe(gulp.dest(distFolder))
);

gulp.task('compressHTMLCS', () =>
  gulp
    .src([
      `${HTMLCSFolder}/Contrib/Build/umd-header.js`,
      `${HTMLCSFolder}/Standards/**/*.js`,
      `${HTMLCSFolder}/HTMLCS.js`,
      `${HTMLCSFolder}/HTMLCS.Util.js`,
      `${HTMLCSFolder}/Contrib/Build/umd-footer.js`,
      `${distFolder}/client/runner.js`
    ])
    .pipe(concat('HTMLCS.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(distFolder))
);

gulp.task('pre-test', () =>
  gulp.src(['dist/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
);

gulp.task('nodeunit', gulp.series('pre-test', () =>
  gulp
    .src(['test/**/*.test.js', 'dist/**/*.spec.js'])
    .pipe(nodeunit({
      reporter: 'junit',
      reporterOptions: {
        output: 'test/xmlResults'
      }
    }))
    .on('error',(err) => {
      process.exit.bind(process, 1);
      // eslint-disable-next-line
      console.error(err);
    })
    .pipe(istanbul.writeReports({
      dir: './test/coverage',
      reporters: ['lcov']
    }))
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 75 } }))
    .pipe(gulp.dest('test/coverage'))
));

gulp.task('developTests', () =>
  gulp
    .src('dist/**/*.spec.js')
    .pipe(nodeunit())
    .on('error',(err) => {
      process.exit.bind(process, 1);
      // eslint-disable-next-line
      console.error(err);
    })
  );


gulp.task('babel:watch', () =>
  gulp.watch(`${srcFolder}/**/*.js`, ['lint', 'babel'])
);

gulp.task('compress:watch', () =>
  gulp.watch(`${distFolder}/runner.js`, ['compressHTMLCS'])
);

gulp.task('test:watch', () =>
  gulp.watch('test/*.js', ['nodeunit'])
);

gulp.task('test:watch', () =>
  gulp.watch('dist/**/*.spec.js', ['developTests'])
);

gulp.task('watch', gulp.parallel('babel:watch', 'compress:watch', 'test:watch'));

// Actual tasks
gulp.task('test', gulp.series('clean', 'lint', 'babel', 'compressHTMLCS', 'nodeunit'));
gulp.task('build', gulp.parallel('lint', 'compressHTMLCS', 'babel'));
gulp.task('default', gulp.parallel('build', 'watch'));
