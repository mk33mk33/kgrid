var Knode = require('../models/knode')
module.exports = function getKnode (obj) {
    // 确保节点存在，不存在则创建，仅确保节点名即可,也做查询用，返回一个节点的数据
    if(!obj || !obj.name)throw 'getKnode error: params error'
    var name = obj.name;
    var key = name.trim().toLowerCase();
    // 必须拿key查
    return Knode.findOne({key:key}).exec().then(doc => {
        console.log('!getKnode',doc)
        return doc
    })
}
