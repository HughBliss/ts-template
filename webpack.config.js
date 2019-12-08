const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = env => {
  const isProduction = env.NODE_ENV === 'production'
  const root = path.join(__dirname, './src')
  const dist = path.join(__dirname, './dist')

  return {
    mode: env.NODE_ENV,

    context: root,

    entry: {
      style: './sass/main.scss',
      main: './ts/main.ts'
    },

    resolve: {
      extensions: ['.ts', '.js'],
      modules: [
        root,
        'node_modules'
      ]
    },

    output: {
      path: dist,
      filename: isProduction ? 'js/[name].js' : "js/[name].[chunkhash].js",
      chunkFilename: isProduction ? 'js/[id].js' : 'js/[id].[chunkhash].js',
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: isProduction ? 'css/[name].css' : 'css/[name].[chunkhash].css',
        chunkFilename: isProduction ? 'css/[id].css' : 'css/[id].[chunkhash].css',
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        template: 'index.html',
        filename: 'index.html'
      }),
    ],

    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          use: 'source-map-loader'
        },
        {
          enforce: 'pre',
          test: /\.ts$/,
          exclude: /node_modules/,
          use: 'tslint-loader'
        },
        {
          test: /\.ts$/,
          exclude: [/node_modules/],
          use: 'awesome-typescript-loader'
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !isProduction,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            },
          ]
        }
      ]
    },

    devtool: 'cheap-module-source-map',
  }
}
