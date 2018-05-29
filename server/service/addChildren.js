var Knode = require('../models/knode')
module.exports = function addChildren (obj) {
    if(!obj || !obj.name || !obj.children)throw 'addChildren error: params error'
    var name = obj.name;
    var key = name.trim().toLowerCase();
    var children = obj.children;
    // 必须拿key查
    return Knode.findOneAndUpdate(
        {key:key},
        {
          $addToSet:{children:children},
          $setOnInsert:{name:name}
        },
        {upsert:true}
      ).exec()

}
