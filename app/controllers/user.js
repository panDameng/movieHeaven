var User = require('../models/user.js');
//post提交中req.body、			req.params、				req.query之间的区别
//			携带的data数据		/user/:id,即路由中的变量	/user/signup?userid=111,即路由内的参数
//req.param()方法都能获取以上三种数据，但是出现同名时优先级为 变量 >data >参数

//signup 注册
exports.signup = function(req, res){
	var _user = req.body.user;
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
		title:'注册页面',
	})
}

//登录跳转页
exports.showSignin = function(req, res){//配置路由  列表页
	res.render('signin', {
		title:'登录页面',
	})
}


//signin登录
exports.signin = function(req, res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

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
				return res.redirect('/signin');
				console.log('Password is not matched');
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

//user list  page
exports.list = function(req, res){//配置路由  列表页
	User.fetch(function(err, users){//查询操作
		if(err){
			console.log(err);
		}
		res.render('userlist', {
			title:'用户列表页',
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


