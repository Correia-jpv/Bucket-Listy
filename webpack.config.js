const path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.(sa|sc|c)ss$/,
      use: [
        // Adds CSS to the DOM by injecting a `<style>` tag
        'style-loader',
        // Interprets `@import` and `url()` like `import/require()` and will resolve them
        'css-loader',
        {
          loader: 'sass-loader',
        },
        // Loader for webpack to process CSS with PostCSS
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: function() {
                return [
                  require('autoprefixer')
                ];
              }
            }
          }
        },
      ]
    }]
  }
};