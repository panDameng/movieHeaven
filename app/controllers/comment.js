var Comment = require('../models/comment.js');
var _ = require('underscore');//

//comment
exports.save = function(req, res){
	var _comment = req.body.comment;
	var movieId = _comment.movie;
	if(_comment.cid){
		Comment.findById(_comment.cid, function(err, comment){//根据评论的id拿到评论的具体内容
			var reply = {//将_comment中得到的数据存入其reply中
				from:_comment.from,
				to:_comment.tid,
				content:_comment.content,
			}
			comment.reply.push(reply);
			comment.save(function(err, comment){//将数据保存入数据库中
				if(err){
					console.log(err);
				}
				res.redirect('/movie/' + movieId);
			})
		})
	}else{//如果未获得cid则表示为新增一条新评论
		var comment = new Comment(_comment);
		comment.save(function(err, movie){
			if(err){
				console.log(err);
			}
			res.redirect('/movie/' + movieId);
		})
	}
}

