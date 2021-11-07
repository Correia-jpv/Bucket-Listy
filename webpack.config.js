const path = require('path'),
  webpack = require('webpack'),
  dotenv = require('dotenv'),
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
      'process.env': JSON.stringify(dotenv.config().parsed) // it will automatically pick up key values from .env file
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })

  ],
  resolve: {
    alias: {
      process: "process/browser"
    }
  }
};