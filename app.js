var express = require('express');
var path = require('path');
var session = require('express-session');//cookie-session可以将session信息存到cookie中，比较方便，但只存id
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);//将session全部信息存入mongodb中
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');//用于处理 JSON, Raw, Text 和 URL 编码的数据
var logger = require('morgan');
var cookieParser = require('cookie-parser');//解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象。
var fs = require('fs');
var port = process.env.PORT || 3000;//如果在环境变量中设置了端口则使用该端口， 否则使用3000端口
var app = express();

mongoose.Promise = global.Promise; //防止后台报promise错 
mongoose.connect('mongodb://localhost/imooc');

//models loading
var models_path = __dirname + '/app/models';
var walk = function(path){
	fs
		.readdirSync(path)//该方法时返回指定目录下的所有文件的数组对象  同步
		.forEach(function(file){
			var newPath = path + '/' + file;
			var stat = fs.statSync(newPath);//返回文件信息的，一个stat数组对象

			if(stat.isFile()){
				if(/(.*)\.(js|coffee)/.test(file)){//正则  是文件且是js/coffee文件。则加载
					require(newPath)
				}
			}
			else if(stat.isDirectory){//是文件夹，继续遍历
				walk(newPath)
			}
		})
}
walk(models_path);//便于在任意路径直接取到models模块

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(serveStatic('public'));//设置静态文件路径
app.use(require('connect-multiparty')());//专门处理enctype="multipart/form-data"文件
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());//有这个session才能正常工作
app.use(session({
	secret:'imooc',//防止cookie被篡改，即计算imooc的hash进行加密,.这个属性值为必须指定的属性。
	name: 'name',//表示cookie的name，默认cookie的name是：connect.sid。
	cookie: {maxAge: 6000000},//cookie过期时间，毫秒。
	resave: false,//是指每次请求都重新设置session cookie，假设你的cookie是6000毫秒过期，每次请求都会再设置6000毫秒。
	saveUninitialized: true,// 是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid。
	store: new mongoStore({//用于数据库的连接
		url:'mongodb://localhost/imooc',
		collection:'sessions'
	})
}))

//对页面报错已经打印信息的修饰
if('development' === app.get('env')){//判断env是否为当前开发环境
	app.set('showStackError', true);//能在屏幕上打印出错误信息
	app.use(logger(':method :url :status'));//打印请求的类型，url路径和状态码
	app.locals.pretty = true;//查看页面源代码时，显示为格式化后的代码
	mongoose.set('debug', true);//开启调试模式，用于查看mongoose模块对mongodb操作的日志。
}

require('./config/routes.js')(app);

app.listen(port);
app.locals.moment = require('moment');
console.log('service started on port' + port);






