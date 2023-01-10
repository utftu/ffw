import {SourceMapConsumer} from 'source-map';
import {readFileSync} from 'node:fs';

const map = JSON.parse(readFileSync('./a/a.js.map').toString());

const consumer = await new SourceMapConsumer(map);

console.log('-----', 'consumer', '\n', consumer.sourceContentFor('../a.ts'));

// console.log(
//   consumer.originalPositionFor({
//     line: 1,
//     column: 1,
//   })
// );

// const rawSourceMap = {
//   version: 3,
//   file: 'min.js',
//   names: ['bar', 'baz', 'n'],
//   sources: ['one.js', 'two.js'],
//   sourceRoot: 'http://example.com/www/js/',
//   mappings:
//     'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA',
// };

// const whatever = await SourceMapConsumer.with(
//   rawSourceMap,
//   null,
//   (consumer) => {
//     console.log(consumer.sourceContentFor('sdsdsds'));

//     // console.log(consumer.sources);
//     // [ 'http://example.com/www/js/one.js',
//     //   'http://example.com/www/js/two.js' ]

// console.log(
//   consumer.originalPositionFor({
//     line: 2,
//     column: 28,
//   })
// );
//     // { source: 'http://example.com/www/js/two.js',
//     //   line: 2,
//     //   column: 10,
//     //   name: 'n' }

//     // console.log(
//     //   consumer.generatedPositionFor({
//     //     source: 'http://example.com/www/js/two.js',
//     //     line: 2,
//     //     column: 10,
//     //   })
//     // );
//     // { line: 2, column: 28 }

//     // consumer.eachMapping(function (m) {
//     //   console.log(m);
//     //   // ...
//     // });

//     // return computeWhatever();
//   }
// );
