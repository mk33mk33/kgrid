var Knode = require('../models/knode')
module.exports = function upsertKnode (obj) {
    // 常规的创建节点，包括各个字段，但是字段都要外部提供
      if(!obj || !obj.name)throw 'upsertKnode error: params error'
      var name = obj.name;
      var key = name.trim().toLowerCase();
      // 必须拿key查
      var updateObj = {
          $setOnInsert:{name:name},// 只有创建新的才使用
          $addToSet:{},
          $set:{}
      };
      // name:parents:children: brother:[String], // p1::k1 p2::k2 related:content:karticles:[ObjectId], // 关联的文章id updatedAt: samenode:ObjectId ,
      if(obj.parents)updateObj.$addToSet.parents = obj.parents.map(s=>{
          return s.trim().toLowerCase()
      })
      if(obj.children)updateObj.$addToSet.children = obj.children.map(s=>{
          return s.trim().toLowerCase()
      })
      if(obj.brother)updateObj.$addToSet.brother = obj.brother.map(s=>{
          // p1::k1 p2::k2 需要自己格式化
          if(!s.match(/::/))throw 'upsertKnode error:兄弟节点数据错误 '+ s
          return s.trim().toLowerCase()
      })
      if(obj.related)updateObj.$addToSet.related = obj.related.map(s=>{
          return s.trim().toLowerCase()
      })
      if(obj.content)updateObj.$set.content = obj.content
      if(obj.karticles)updateObj.$addToSet.karticles = obj.karticles
      if(obj.samenode)updateObj.$set.samenode = obj.samenode.trim().toLowerCase() // samenode应该用key
      updateObj.$set.updatedAt = Date.now()

      if(!Object.keys(updateObj.$addToSet).length)delete updateObj.$addToSet
      if(!Object.keys(updateObj.$set).length)delete updateObj.$set
      return Knode.findOneAndUpdate(
          {key:key},
          updateObj,
          {upsert:true}
        ).exec().then(doc => {
          console.log('!upsertKnode',doc)
          return doc
      })

}
