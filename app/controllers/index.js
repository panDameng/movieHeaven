var Movie = require('../models/movie.js');
var Category = require('../models/category.js');
//index 首页
exports.index = function(req, res){//配置路由 index页
	Category
		.find({})
		.populate({path:'movies', options:{limit:5}})//限制电影显示数为5
		.exec(function(err, categories){
			if(err){
				console.log(err);
			}
			res.render('index', {//如果本地user存在，则渲染时就能读到user信息
			title:'imooc首页',
			categories:categories
			})
		})
}

//search
exports.search = function(req, res){//配置路由 分类搜索页
	var catId = req.query.cat;
	var q = req.query.q;
	var page = parseInt(req.query.p, 10) || 0;
	var count = 2;
	var index = page * count;//页数乘以条数

	if(catId) {//不是通过搜索进来的电影，而是直接点击电影类型进入
		Category
			.find({_id:catId})
			.populate({
				path:'movies', 
				select:'title poster'
				// options:{limit:2, skip:index}
			})//限制电影显示数为5,从第index条开始查
			.exec(function(err, categories){
				if(err){
					console.log(err);
				}
				var category = categories[0] || {};
				var movies = category.movies || [];//存在返回对应数据，不存在则返回空数组
				var results = movies.slice(index, index + count);
				res.render('results', {//如果本地user存在，则渲染时就能读到user信息
					title:'imooc结果列表页',
					keyword:category.name,
					query:'cat=' + catId,
					currentPage:(page + 1),
					totalPage:Math.ceil(movies.length / 2),//对得到数据向上取整
					movies:results
				})
			})
	}else{//通过正则达到模糊匹配
		Movie
			.find({title : new RegExp(q + '.*', 'i')})
			.exec(function(err, movies){
				if(err){
					console.log(err);
				}
				var results = movies.slice(index, index + count);
				res.render('results', {//如果本地user存在，则渲染时就能读到user信息
					title:'imooc结果列表页',
					keyword:q,
					query:'q=' + q,
					currentPage:(page + 1),
					totalPage:Math.ceil(movies.length / count),//对得到数据向上取整
					movies:results
				})
			})
	}
}

