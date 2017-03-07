var mongoose = require('mongoose');
var CategorySchema = require('../schemas/category.js');
var Category = mongoose.model('Category', CategorySchema);//生成对应的movie模型

module.exports = Category;