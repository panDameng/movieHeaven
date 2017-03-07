var Index = require('../app/controllers/index.js');//获取首页
var Movie = require('../app/controllers/movie.js');
var User = require('../app/controllers/user.js');
var Comment = require('../app/controllers/comment.js');
var Category = require('../app/controllers/category.js');

module.exports = function(app){
	//pre handle user  预处理用户，即判断是否存在session.user
	app.use(function(req, res, next){
		var _user = req.session.user;
		app.locals.user = _user;//如果session中存在user，将该user信息存入本地,不存在时存入便于清空
		next();
	})

	//Index
	app.get('/', Index.index);//index page 

	//User
	app.post('/user/signup', User.signup);//signup
	app.post('/user/signin', User.signin);//signin
	app.get('/signin', User.showSignin);
	app.get('/signup', User.showSignup);
	app.get('/logout', User.logout);//logout
	app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);//userlist page
	//所有admin相关的页面都设置用户权限，添加了相应的中间件
	//Movie
	app.get('/movie/:id', Movie.detail);//detail page
	app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);//admin new page
	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);//admin update page
	app.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save);//admin post movie
	app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);//list page
	app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);//movie delete

	//Comment
	app.post('/user/comment', User.signinRequired, Comment.save);//admin comment

	//category
	app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
	app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
	app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);

	//results
	app.get('/results', Index.search);//分类搜索
}