var Movie = require('../models/movie.js');
var Category = require('../models/category.js');
var Comment = require('../models/comment.js');
var _ = require('underscore');//
var fs = require('fs');
var path = require('path');

exports.detail = function(req, res){
	var id = req.params.id;
	Movie.update({_id:id}, {$inc:{pv:1}}, function(err){
		if(err){
			console.log(err);
		}
	})
	Movie.findById(id, function(err, movie){
		Comment
			.find({movie:id})//妙用populate 与数据库关系ref，就能在其他文档嵌入id的情况下获得该id相关的其他数据
			.populate('from', 'name')
			.populate('from', 'head')
			.populate('reply.from reply.to', 'name head')//name 和head分行写就不行，待我查api
			.exec(function(err, comments){
				console.log(comments);
				res.render('detail', {
					title:'影片更新',
					movie:movie,
					comments:comments
				})
			})			
	})
}

//admin new page
exports.new = function(req, res){//配置路由 后台录入页
	Category.find({}, function(err, categories){
		Movie.gainMaxId(function(err, movie){
			if(movie.length == 0){//如果数据库没有数据
				var movie = [{_id:0,}];
			}
			res.render('admin', {
				title:'影片录入',
				categories:categories,

				movie:{
					category:'',
					director:'',
					country:'',
					title:'',
					year:'',
					poster:'',
					language:'',
					flash:'',
					summary:'',
					_id:movie[0]._id+1
				}
			})
		})
	})
}

exports.update = function(req, res){
	var id = req.params.id;
	if(id){
		Movie.findById(id, function(err, movie){
			Category.find({}, function(err, categories){
				res.render('admin', {
					title:'影片更新',
					movie:movie,
					categories:categories
				})
			})
		})
	}
}

//admin poster
exports.savePoster = function(req, res, next){
	var posterData = req.files.uploadPoster;//获得上传的海报文件
	var filePath = posterData.path;//获取文件的路径
	console.log(filePath);
	console.log(posterData);
	var originalFilename = posterData.originalFilename;//获得图片原始的名字
	console.log(originalFilename);
	if(originalFilename){//如果存在名字说明有传送的图片
		fs.readFile(filePath, function(err, data){
			//获得图片路径中的二进制文件数据，获得data为图片的具体数据
			var timestamp = Date.now();//声明时间戳，用来命名新图片的名字
			var type = posterData.type.split('/')[1];//获得文件的类型
			var poster = timestamp + '.' + type;
			//生成一个服务器存图片的地址,_dirname为当前文件所在目录，存入后者目录
			var newPath = path.join(__dirname, '../../', '/public/upload/poster/' + poster);//上上层目录
			fs.writeFile(newPath, data, function(err){
				req.poster = poster;//将poster存到request上
				console.log(poster);
				next();
			})

		})
	}else{//无文件上次直接进入next
		next();
	}
}

//admin post save
exports.save = function(req, res){
	var id = req.body.movie._id;//req.body获取的是请求携带的数据
	var movieObj = req.body.movie;
	var _movie;
	if(req.poster){//如果存在说明savePoster中间件存入了poster
		movieObj.poster = req.poster;
	}

	var j = 0;//判断是否进入了修改
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
		for(var i = 0; i < movies.length; i++){//判断是新增还是修改
			if(id == movies[i]._id){
				console.log(movies[i]._id);
				j = 1;
				Movie.findById(id, function(err, movie){
					if(err){
						console.log(err);
					}
					_movie = _.extend(movie, movieObj);//复制后者的全部属性，并覆盖到前者
					_movie.save(function(err, movie){
						if(err){
							console.log(err);
						}
						res.redirect('/movie/' + movie._id);//如果保存成功，则重定向到movie页面
					})
					
				})
			
			}
			else if(i == movies.length-1 && j ==0){
				_movie = new Movie(movieObj);
				var categoryId = movieObj.category;
				var categoryName = movieObj.categoryName;

				_movie.save(function(err, movie){
					if(err){
						console.log(err);
					}
					if(categoryId){//在录入页如果选择了分类则直接录入
						Category.findById(categoryId, function(err, category){
							category.movies.push(_movie._id);
							category.save(function(err, category){
								res.redirect('/movie/' + movie._id);
							})
						})
					}else if (categoryName) {//如果未选择分类，且输入了新的分类，则添加新的分类,存入当前电影id
						var category = new Category({
							name:categoryName,
							movies:[_movie._id],
						})
						category.save(function(err, category){
							movie.category = category._id;
							movie.save(function(err, movie){
								res.redirect('/movie/' + movie._id);	
							})
						})
					}
				})
			}
		}
	})
}
	// if(id !== 'undefined'){//如何id不是新的，则直接覆盖之前信息
	// 	Movie.findById(id, function(err, movie){
	// 		if(err){
	// 			console.log(err);
	// 		}

	// 		_movie = _.extend(movie, movieObj);//复制后者的全部属性，并覆盖到前者
	// 		_movie.save(function(err, movie){
	// 			if(err){
	// 				console.log(err);
	// 			}
	// 			res.redirect('/movie/' + movie._id);//如果保存成功，则重定向到movie页面
	// 		})
			
	// 	})
	// }else{//如果id是新的，这新声明

	// 	_movie = new Movie({
	// 		director:movieObj.director,
	// 		title:movieObj.title,
	// 		language:movieObj.language,
	// 		country:movieObj.country,
	// 		summary:movieObj.summary,
	// 		flash:movieObj.flash,
	// 		poster:movieObj.poster,
	// 		year:movieObj.year,
	// 		_id: movieObj._id
	// 	})
	// 	console.log(_movie)
	// 	_movie.save(function(err, movie){
	// 		if(err){
	// 			console.log(err);
	// 		}
	// 		console.log(movie)
	// 		res.redirect('/movie/' + movie._id);
	// 	})
	// }
// })

//list page
exports.list = function(req, res){//配置路由  列表页
	var q = req.query.q;
	var page = parseInt(req.query.p, 10) || 0;
	var count = 8;//设置每页6份数据
	var index = page * count;//页数乘以条数
	Movie.fetch(function(err, movies){//查询操作
		if(err){
			console.log(err);
		}
		var results = movies.slice(index, index + count);
		res.render('list', {
			title:'影片列表',
			keyword:q,
			// query:'q=' + q,
			currentPage:(page + 1),
			totalPage:Math.ceil(movies.length / count),//对得到数据向上取整
			movies:results
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

//search
exports.search = function(req, res){//配置路由 分类搜索页
	var q = req.query.q;
	var page = parseInt(req.query.p, 10) || 0;
	var count = 6;//设置每页6份数据
	var index = page * count;//页数乘以条数
//通过正则达到模糊匹配
	Movie
		.find({title : new RegExp(q + '.*', 'i')})
		.exec(function(err, movies){
			if(err){
				console.log(err);
			}
			//var results = movies.slice(index, index + count);
			res.render('list', {//如果本地user存在，则渲染时就能读到user信息
				title:'搜索影片结果',
				keyword:q,
				query:'q=' + q,
				//currentPage:(page + 1),
				//totalPage:Math.ceil(movies.length / count),//对得到数据向上取整
				movies:movies
			})
		})
}



