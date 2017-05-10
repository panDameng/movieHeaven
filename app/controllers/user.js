var User = require('../models/user.js');
var fs = require('fs');
var path = require('path');
//post提交中req.body、			req.params、				req.query之间的区别
//			携带的data数据		/user/:id,即路由中的变量	/user/signup?userid=111,即路由内的参数
//req.param()方法都能获取以上三种数据，但是出现同名时优先级为 变量 >data >参数

//signup 注册
exports.signup = function(req, res){
	var _user = req.body.user;
	console.log(235677);
	console.log(_user.password);
	console.log(_user.name);
	User.findOne({name:_user.name}, function(err, user){
		if(err){
			console.log(err);
		}
		if(user) {
			return res.redirect('/signin');
		}else{
			var user = new User(_user);
			user.save(function(err, user){
			if(err){
				console.log(err);
			}
			res.redirect('/');
			})
		}
	})
}

//登出跳转页
exports.showSignup = function(req, res){//配置路由  列表页
	res.render('signup', {
		title:'账户注册',
	})
}

//登录跳转页
exports.showSignin = function(req, res){//配置路由  列表页
	res.render('signin', {
		title:'账户登录',
	})
}


//signin登录
exports.signin = function(req, res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	console.log(215125);
	console.log(password);
	User.findOne({name:name}, function(err, user){
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/signup');
		}
		user.comparePassword(password, function(err, isMatch){
			if(err){
				console.log(err);
			}
			if(isMatch){//对加盐后的密码进行比对
				req.session.user = user;
				return res.redirect('/');
			}else{
				console.log(isMatch);
				console.log('Password is not matched');
				return res.redirect('/signin');
			}
		})
	})
}

//logout登出
exports.logout = function(req, res){
	delete req.session.user;
//	delete app.locals.user;//登出时同时删除本地user信息
	res.redirect('/');
}

//验证注册名是否存在
exports.verifyUserName = function(req, res){
	var name = req.body.data;
	User.findByName(name, function(err, user){
		if(user == null){
			res.json(1);//如果注册名不重复返回1
		}else{
			res.json(0);//如果注册名重复返回0
		}
	})
}

//user list  page
exports.list = function(req, res){//配置路由  列表页
	User.fetch(function(err, users){//查询操作
		if(err){
			console.log(err);
		}
		res.render('userlist', {
			title:'用户列表',
			users:users
		})
	})
}

//midware for user 用户中间件, 判断是否登录
exports.signinRequired = function(req, res, next){//next表示当前流程走完走向下一个流程
	var user = req.session.user;
	if(!user){//未登录无法访问列表页
		return res.redirect('/signin');
	}
	next();
}

//midware for admin 管理员中间件  判断是否是管理员以上权限
exports.adminRequired = function(req, res, next){//next表示当前流程走完走向下一个流程
	var user = req.session.user;
	if(user.role <= 10){//未登录无法访问列表页
		return res.redirect('/signin');
	}
	next();
}

exports.userDetail = function(req, res){
	var _id = req.params._id;//获取路由中传过来的_id的值
	User.findById(_id, function(err,user){
		console.log(_id);
		console.log(23434);
		console.log(user);
		res.render('user_detail',{
			title:'用户个人资料',
			user:user
		})
	});
	
}

exports.alterHead = function(req, res){
	var headPictrue = req.files.formData;//获得ajax传过来的data类型数据
	var userId = req.session.user._id;//获得登录的当前用户id
	//获取文件中的数据，，必须注意的是必须添加了connect-multiparty，来对formdata进行处理
	var filePath = headPictrue.path;//获取文件的路径
	console.log(filePath);
	console.log(headPictrue);
	var originalFilename = headPictrue.originalFilename;//获得图片原始的名字
	console.log(originalFilename);
	if(originalFilename){//如果存在名字说明有传送的图片
		fs.readFile(filePath, function(err, data){
			//获得图片路径中的二进制文件数据，获得data为图片的具体数据
			var timestamp = Date.now();//声明时间戳，用来命名新图片的名字
			var type = headPictrue.type.split('/')[1];//获得文件的类型
			var poster = timestamp + '.' + type;
			//生成一个服务器存图片的地址,_dirname为当前文件所在目录，存入后者目录
			var newPath = path.join(__dirname, '../../', '/public/upload/head-portrait/' + poster);//上上层目录
			fs.writeFile(newPath, data, function(err){
				res.json(poster);//将poster存到request上
				console.log(req.session.user);
				User.findById(userId, function(err, user){//更新操作，先查询出数据，将数据中修改好再存入
					user.head = poster;
					console.log(23456);
					user.save(function(err){
						console.log(user);
					})
				})
			})

		})
	}
}

exports.alterPassword = function(req, res){
	var _user = req.session.user;
	var name = _user.name;
	var password = _user.password;//用户数据库的密码
	var userPassword = req.body.user;//表单传入的新旧密码

	User.findOne({name:name}, function(err, user){
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/signup');
		}
		user.comparePassword(userPassword.oldPassword, function(err, isMatch){
			if(err){
				console.log(err);
			}
			if(isMatch){//对加盐后的密码进行比对
				req.session.user = user;
				user.password = userPassword.newPassword1;//将密码保存到数据库，之后自动调用加盐
				user.save(function(err, user){
					if(err){
						console.log(err);
					}
				})
				delete req.session.user;
				res.render('signin',{
					title:'账户登录',
					alterEnter:1//该值为1表示进入登录页面的方式为修改密码后，便于显示弹窗
				})
				// res.josn(1);
				// return res.redirect('/signin');
			}else{
				//res.
				console.log('Password is not matched');
			}
		})
	})

//	delete req.session.user;
//	delete app.locals.user;//登出时同时删除本地user信息
}

	//删除用户
	// list delete user
exports.del = function(req, res){
	var id = req.query.id;//query获得路由中？后携带的参数
	console.log(233432423);
	if(id){
		User.remove({_id:id}, function(err, user){
			if(err){
				console.log(err);
			}else{
				res.json({success:1})
			}
		})
	}
}

//search
exports.search = function(req, res){//配置路由 分类搜索页
	var q = req.query.q;
	var page = parseInt(req.query.p, 10) || 0;
	var count = 6;//设置每页6份数据
	var index = page * count;//页数乘以条数
//通过正则达到模糊匹配
	User
		.find({name : new RegExp(q + '.*', 'i')})
		.exec(function(err, users){
			if(err){
				console.log(err);
			}
			//var results = movies.slice(index, index + count);
			res.render('userlist', {//如果本地user存在，则渲染时就能读到user信息
				title:'用户列表',
				keyword:q,
				query:'q=' + q,
				//currentPage:(page + 1),
				//totalPage:Math.ceil(movies.length / count),//对得到数据向上取整
				users:users
			})
		})
}