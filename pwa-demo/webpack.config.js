// const path = require('path');
// const htmlPlugin = require('html-webpack-plugin');
// const webpack = require('webpack');

// module.exports = {
//   entry: ['webpack-hot-middleware/client','./src/js/main.js'],
//   output:{
// 		path: path.resolve(__dirname,'./dist'),
// 		publicPath: '/',
//     filename: '[name].bundle.js'
// 	},
// 	devServer: {
// 		inline: true,
// 		contentBase: './dist',
// 		port: 3003,
// 		hot: true
// 	},
//   plugins:[
//     new webpack.HotModuleReplacementPlugin(),
//     new webpack.NoEmitOnErrorsPlugin(),
//     new htmlPlugin({
//       template: path.resolve(__dirname,'./index.html')
//     })
// 	],
// 	devtool: 'inline-source-map',
// 	// mode: 'development',
// 	watch: true,
//   module:{
//     rules: [
//       {
// 				test: /\.css$/,
// 				use: [
// 					'style-loader',
// 					'css-loader'
// 				]
// 			},
//     ]
//   }
// }