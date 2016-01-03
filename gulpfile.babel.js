import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';

const srcFolder = './src';
const distFolder = './dist';
const HTMLCSFolder = './node_modules/HTML_CodeSniffer';

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
    .on('error', console.error.bind(console))
    .pipe(gulp.dest(distFolder))
);

gulp.task('compressHTMLCS', () =>
  gulp
    .src([
      `${HTMLCSFolder}/Standards/**/*.js`,
      `${HTMLCSFolder}/HTMLCS.js`,
      `${srcFolder}/runner.js`
    ])
    .pipe(uglify())
    .pipe(rename('HTMLCS.min.js'))
    .pipe(gulp.dest(distFolder))
);

gulp.task('babel:watch', () =>
  gulp
    .watch('./src/**/*.js', ['lint', 'babel'])
);

// Actual tasks
gulp.task('test', ['lint']);
gulp.task('default', ['lint', 'compressHTMLCS', 'babel', 'babel:watch']);
