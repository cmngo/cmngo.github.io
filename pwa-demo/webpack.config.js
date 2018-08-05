const path = require('path');
const htmlPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ['webpack-hot-middleware/client','./src/js/main.js'],
  output:{
		path: path.resolve(__dirname,'./dist'),
		publicPath: '/',
    filename: '[name].bundle.js'
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new htmlPlugin({
      template: path.resolve(__dirname,'./index.html')
    })
	],
	// mode: 'development',
	watch: true,
	devServer: { inline: true },
  resolve:{
    extensions: ['.js','.vue'],
    alias:{
      'vue':'vue/dist/vue.js'
    }
  },
  module:{
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
}