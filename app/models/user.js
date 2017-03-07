var mongoose = require('mongoose');
var UserSchema = require('../schemas/user.js');
var User = mongoose.model('User', UserSchema);//生成对应的movie模型

module.exports = User;