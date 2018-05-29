var Knode = require('../models/knode')
module.exports = function ensureKnode (obj) {
    // 确保节点存在，不存在则创建，仅确保节点名即可,也做查询用，返回一个节点的数据
    if(!obj || !obj.name)throw 'ensureKnode error: params error'
    var name = obj.name;
    var key = name.trim().toLowerCase();
    // 必须拿key查
    return Knode.findOneAndUpdate(
        {key:key},
        {
          $setOnInsert:{name:name}
        },
        {upsert:true}
      ).exec().then(doc => {
        console.log('!ensureKnode',doc)
        return doc
    })

}
