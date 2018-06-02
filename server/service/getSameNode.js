var Knode = require('../models/knode')
module.exports = function getSameNode (obj){
    // 查询节点，不默认创建
    if(!obj || !obj.name)throw 'getSameNode error: params error'
    var name = obj.name;
    var key = name.trim().toLowerCase();
    // 必须拿key查
    return Knode.find({samenode:key}).exec().then(doc => {
        console.log('!getSameNode',doc)
        return doc
    })

}
