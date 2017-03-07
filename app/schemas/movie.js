var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MovieSchema = new Schema({
	_id:Number,
	director:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	pv:{//对某部电影的访问量
		type:Number,
		default:0
	},
	category:{
		type:ObjectId,
		ref:'Category'
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

MovieSchema.pre('save', function(next){//每次存储数据之前都会调用该方法
	if(this.isNew) {//如果数据是新加，就将创建时间和更新时间设置为当前时间
		this.meta.creatAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	next();
});

MovieSchema.statics = {
	fetch: function(cb){//取出数据库中所有的数据
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findById: function(id, cb){//取出数据库中所有的数据
		return this.findOne({_id:id}).exec(cb);
	},
	gainMaxId:function(cb){
		return this.find({}).sort({"_id": -1}).limit(1).exec(cb);
	}
};

module.exports = MovieSchema;