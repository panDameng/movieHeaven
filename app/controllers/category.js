var Category = require('../models/category.js');

//admin new page
exports.new = function(req, res){//配置路由 后台录入页
	res.render('category_admin', {
		title:'imooc后台分类录入页',
		category:{}
	})
}

//admin post save
exports.save = function(req, res){
	var _category = req.body.category;//req.body获取的是请求携带的数据
	var category = new Category(_category);
	category.save(function(err, movie){
		if(err){
			console.log(err);
		}
		res.redirect('/admin/category/list');
	})
}

// category list page
exports.list = function(req, res){//配置路由  列表页
	
	Category.fetch(function(err, categories){//查询操作
		if(err){
			console.log(err);
		}
		res.render('categorylist', {
			title:'imooc分类列表页',
			categories:categories
		})
	})
}


// list delete movie
exports.del = function(req, res){
	var id = req.query.id;//query获得路由中？后携带的参数
	if(id){
		Movie.remove({_id:id}, function(err, movie){
			if(err){
				console.log(err);
			}else{
				res.json({success:1})
			}
		})
	}
}
