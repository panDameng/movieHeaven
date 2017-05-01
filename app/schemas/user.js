var mongoose = require('mongoose');
var bcrypt = require("bcryptjs");//对密码进行加盐操作，以降低暴力破解和查字典等方式破解的效率
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:String,
	head:{
		type:String,
		default:'icon-head.png'
	},
	role:{//0:normal user,1:verified user 认证,2:professional user信息完备 >10:admin >50superadmin
		type:Number,
		default:0
	},
	meta:{//录入或更新数据的时间记录
		creatAt:{//创建时间
			type:Date,
			default:Date.now()
		},
		updateAt:{//创建时间
			type:Date,
			default:Date.now()
		}
	}
})

UserSchema.pre('save', function(next){//每次存储数据之前都会调用该方法
	var user = this;  //user为当前user
	if(this.isNew) {//如果数据是新加，就将创建时间和更新时间设置为当前时间
		this.meta.creatAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){//生成随机盐，第一个参数为计算强调，越大则越难被破解
		if(err){
			return next(err);
		}
		//进行hash加密
		bcrypt.hash(user.password, salt, function(err, hash){//获得随机盐和用户密码，进行hash加密
			if(err){
				return next(err);
			}
			user.password = hash;//将hash加密后的值存密码中
			next();
		})
	})
});

//添加实例方法， 实例才能调用
UserSchema.methods = {
	comparePassword:function(_password, cb){
		bcrypt.compare(_password, this.password, function(err, isMatch){//用来匹配加密的密码
			if(err){
				return cb(err);
			}
			cb(null, isMatch);
		})
	}
}

UserSchema.statics = {//静态方法模型便可以调用的方法
	fetch: function(cb){//取出数据库中所有的数据
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findById: function(id, cb){//取出数据库中相应id数据
		return this.findOne({_id:id}).exec(cb);
	},
	findByName:function(name, cb){//根据用户名取得相应数据
		return this.findOne({name:name}).exec(cb);
	},
	gainMaxId:function(cb){
		return this.find({}).sort({"_id": -1}).limit(1).exec(cb);
	}
};

module.exports = UserSchema;