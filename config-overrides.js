const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = Object.assign(config.resolve.fallback || {}, {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    buffer: require.resolve('buffer'),
    path: require.resolve('path-browserify'),
  });
  config.resolve.extensions = ['.ts', '.js', '.tsx'];
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    // new webpack.ProvidePlugin({
    //   process: 'process/browser',
    // }),
  ]);

  return config;
};
