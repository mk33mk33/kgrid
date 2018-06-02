var Knode = require('../models/knode')
module.exports = function getKnode (obj) {
    // 查询节点，不默认创建
    if(!obj || !obj.name)throw 'getKnode error: params error'
    var name = obj.name;
    var key = name.trim().toLowerCase();
    // 必须拿key查
    return Knode.findOne({key:key}).exec().then(doc => {
        console.log('!getKnode',doc)
        return doc
    })
}
