var  conn = require('./conn')
var  mongoose = require('mongoose')
var  Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// 非关系型数据库，没有主键外键约束性条件
// key和name 的关系  key是唯一的，但是平时一般用name,入库时必须用key，只有创建节点和修改name时可以用name
const KnodeSchema = new Schema({
   nid: ObjectId,
   key:{type: String, lowercase: true, trim: true, unique:true}, // 节点名 唯一，怎么能忽略大小写 或者必须小写 但是怎么能还原成大写 是否该用md5,因为有中文
   name:String,
   parents: [String],
   children: [String],
   brother:[String], // p1::k1 p2::k2
   related:[String],
   content:String,
   karticles:[ObjectId], // 关联的文章id
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
   deletedAt: Date,
   samenode:ObjectId //同义词节点
});

var Knode = conn.model('knode',KnodeSchema)
module.exports = Knode;
