var Knode = require('../models/knode')
module.exports = function addParents (obj) {
    if(!obj || !obj.name || !obj.parents)throw 'addChildren error: params error'
    var name = obj.name;
    var key = name.trim().toLowerCase();
    var parents = obj.parents;
    // 必须拿key查
    return Knode.findOneAndUpdate(
        {key:key},
        {
          $addToSet:{parents:parents},
          $setOnInsert:{name:name}
        },
        {upsert:true}
      ).exec()

}
