var AccessSniff = require('../dist');
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

// add tests
suite
.add('Phantomjs', {
  defer: true,
  maxTime: 60,
  fn: (deferred) => {
    AccessSniff
      .default('./test/_site/**/*.html', {
        force: true,
        verbose: false
      })
      .then(report => {
        deferred.resolve();
      });
  }
})
// .add('JSDom', {
//   defer: true,
//   maxTime: 60,
//   fn: (deferred) => {
//     AccessSniff
//       .default('./test/_site/**/*.html', {
//         force: true,
//         verbose: false,
//         template: true
//       })
//       .then(report => {
//         deferred.resolve();
//       });
//   }
// })
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Slowest is ' + this.filter('slowest').map('name'));
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });
