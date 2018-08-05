var express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.js');
var app = express();


//给webpack带上配置
const compiler = webpack(config);
//自动更新编译代码中间件
const devMiddleWare = require('webpack-dev-middleware')(compiler,{});
//自动刷新浏览器中间件
const hotMiddleWare = require('webpack-hot-middleware')(compiler);


//调用2个中间件
app.use(devMiddleWare);
app.use(hotMiddleWare);

app.use(express.static(__dirname + '/dist'));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hello world2');
});

app.listen(process.env.PORT || 3003, function() {
  console.log('Local Server : http://localhost:3003');
});