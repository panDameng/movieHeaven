var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment.js');
var Comment = mongoose.model('Comment', CommentSchema);//生成对应的movie模型

module.exports = Comment; 