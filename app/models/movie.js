var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie.js');
var Movie = mongoose.model('Movie', MovieSchema);//生成对应的movie模型

module.exports = Movie;