module.exports = {
  presets: ['@babel/preset-typescript', '@babel/preset-env'],
  plugins: [
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-proposal-class-properties'],
  ],
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
};
