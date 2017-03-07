var crypto = require('crypto');
var bcrypt = require("bcryptjs");

function getRandomString(len){//随机获得字符串，用来测试user时的名字
	if(!len) {
		len = 16;//默认长度为16；
	}
	return crypto.randomBytes(Math.ceil(len/2)).toString('hex');
}

var should = require('should');//断言库
var app = require('../../app.js');
var mongoose = require('mongoose');
var User = require('../../app/models/user.js');
var User = mongoose.model('User');

var user;

//test
describe('<Unit Test', function(){
	describe('Model User:', function(){
		before(function(done){//测试开始前，声明user，给 name和password
			user ={
				name:getRandomString(),
				password:'password'
			} 
			done();//满足以上条件才执行调用回调函数
		})

		describe('Before Method save', function(){//执行save之前
			it('should begin without test user', function(done){
				User.find({name:user.name}, function(err, users){
					users.should.have.length(0);//判断user的长度是否为0，为0才会向下走

					done();
				})
			})
		})


		describe('User save', function(){//执行save之前
			it('should save without problems', function(done){
				var _user = new User(user);
				_user.save(function(err){
					should.not.exist(err);
					_user.remove(function(err){
						should.not.exist(err);
						done();
					})
				})
			})

			it('should password be hashed correctly', function(done){
				var password = user.password;
				var _user = new User(user);
				_user.save(function(err){
					should.not.exist(err)//翻译为确保不存在错误
					_user.password.should.not.have.length(0);//保证长度不为0

					bcrypt.compare(password, _user.password, function(err, isMatch){//进行密码比对
						should.not.exist(err);
						isMatch.should.equal(true);

						_user.remove(function(err){
							should.not.exist(err);
							done();
						})
					})
				})
			})

			it('should have default role 0', function(done){
				var _user = new User(user);

				_user.save(function(err){
					_user.role.should.equal(0);//保证权限为0
					
					_user.remove(function(err){
						done();
					})
				})
			})

			it('should fail to save an existing user', function(done){
				var _user1 = new User(user);
				_user1.save(function(err) {
		        	should.not.exist(err);

		        	var _user2 = new User(user);
		        	_user2.save(function(err) {
		        		should.exist(err);

		        		_user1.remove(function(err) {
		            		if (!err) {
		                		_user2.remove(function(err) {
		                  			done();
		                		})
		              		}
		            	})
		        	})
		        })
			})
	    })
	    after(function(done) {
	      // clear user info
	      done()
	    })
	})
})