import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['./a.js'],
  bundle: true,
  format: 'esm',
  minify: true,
  platform: 'node',
  outfile: './exbuild.out.js',
});