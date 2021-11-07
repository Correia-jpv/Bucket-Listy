const path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin')

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
          }
        ]
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
        options: {
          esModule: false,
        },
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/views/layout.js',
      page: 'home',
      filename: 'index.html',
      title: 'Home'
    }),
    new HtmlWebpackPlugin({
      template: './src/views/layout.js',
      page: 'privacy',
      filename: 'privacy.html',
      title: 'Privacy policy'
    }),
    new webpack.DefinePlugin({
      "process.env": {
        API_URL: JSON.stringify("API_URL"),
        API_KEY: JSON.stringify("API_KEY")
      }
    })

  ],
};