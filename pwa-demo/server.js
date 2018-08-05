var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
// const webpack = require('webpack');
// const config = require('./webpack.config.js');
var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//给webpack带上配置
// const compiler = webpack(config);
// //自动更新编译代码中间件
// const devMiddleWare = require('webpack-dev-middleware')(compiler,{});
// //自动刷新浏览器中间件
// const hotMiddleWare = require('webpack-hot-middleware')(compiler);


//调用2个中间件
// app.use(devMiddleWare);
// app.use(hotMiddleWare);

// app.use(express.static(__dirname + '/dist'));
app.use(express.static(path.join(__dirname, '/src')))

// respond with "hello world" when a GET request is made to the homepage
// app.get('/', function(req, res) {
//   res.send('hello world2');
// });

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Home page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// Article page
app.get('/article', function (req, res) {
  res.sendFile(path.join(__dirname + '/article.html'));
});


app.listen(process.env.PORT || 3003, function() {
  console.log('Local Server : http://localhost:3003');
});