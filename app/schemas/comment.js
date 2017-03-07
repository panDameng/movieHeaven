var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
	movie:{type:Number, ref:'Movie'},//定义评论电影，类型为其_id的类型， 指向Movie模型,便于使用populate嵌套查询
	from:{type:ObjectId, ref:'User'},//评论，指向用户
	reply:[{//回复体，叠楼方式类似贴吧，所以回复为数组
		from:{type:ObjectId, ref:'User'},
		to:{type:ObjectId, ref:'User'},//回复，指向用户
		content:String,
	}],
	content:String,
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

CommentSchema.pre('save', function(next){//每次存储数据之前都会调用该方法
	if(this.isNew) {//如果数据是新加，就将创建时间和更新时间设置为当前时间
		this.meta.creatAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	next();
});

CommentSchema.statics = {
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

module.exports = CommentSchema;