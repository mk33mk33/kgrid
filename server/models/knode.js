const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// 非关系型数据库，没有主键外键约束性条件
const KnodeSchema = new Schema({
   nid: ObjectId,
   name:{type: String, lowercase: true, trim: true}, // 节点名 唯一，怎么能忽略大小写 或者必须小写 但是怎么能还原成大写
   alias:String,
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

var Knode = mongoose.model('Knode',KnodeSchema)
module.exports = Knode;
