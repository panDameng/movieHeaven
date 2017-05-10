var Category = require('../models/category.js');

//admin new page
exports.update = function(req, res){//配置路由 后台录入页
	var id = req.params.id;//
	if(id){
		Category.findById(id, function(err, category){
			res.render('category_admin', {
				title:'电影分类录入',
				category:category
			})
		})
	}
	
}

//admin post save
exports.save = function(req, res){
	var _category = req.body.category;//req.body获取的是请求携带的数据
//	console.log(_category.name);
	if(_category.id){//判断是否有ID传入，有则表示修改，无责表示新增
		Category.findById(_category.id, function(err, category){
			category.name = _category.name;
			category.save(function(err, category){
				if(err){
					console.log(err);
				}
//				console.log(21312516);
//				console.log(_category.name);
				res.redirect('/admin/category/list');
			})
		})
	}else{//新增分类
		var category = new Category(_category);
		category.save(function(err, movie){
			if(err){
				console.log(err);
			}
			res.redirect('/admin/category/list');
		})
	}
}

// category list page
exports.list = function(req, res){//配置路由  列表页
	
	Category.fetch(function(err, categories){//查询操作
		if(err){
			console.log(err);
		}
		res.render('categorylist', {
			title:'电影分类列表',
			categories:categories
		})
	})
}


//删除电影分类
// list delete category
exports.del = function(req, res){
	var id = req.query.id;//query获得路由中？后携带的参数
	if(id){
		Category.remove({_id:id}, function(err, category){
			if(err){
				console.log(err);
			}else{
				res.json({success:1})
			}
		})
	}
}

exports.search = function(req, res){//配置路由 分类搜索页
	var q = req.query.q;
	var page = parseInt(req.query.p, 10) || 0;
	var count = 6;//设置每页6份数据
	var index = page * count;//页数乘以条数
//通过正则达到模糊匹配
	Category
		.find({name : new RegExp(q + '.*', 'i')})
		.exec(function(err, categories){
			if(err){
				console.log(err);
			}
			//var results = movies.slice(index, index + count);
			res.render('categorylist', {//如果本地user存在，则渲染时就能读到user信息
				title:'电影分类搜索',
				keyword:q,
				query:'q=' + q,
				//currentPage:(page + 1),
				//totalPage:Math.ceil(movies.length / count),//对得到数据向上取整
				categories:categories
			})
		})
}
