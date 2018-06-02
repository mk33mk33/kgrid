// 已确保节点存在，添加同义词
// 一个节点只能作为唯一一个节点的同义词
// 同义词不能再有同义词
var ensureKnode = require('../../service/ensureKnode')
var upsertKnode = require('../../service/upsertKnode')
var SameNodeError = require('../../error').SameNodeError
function addSameNode (ctx) {
    var obj = ctx.request.body;
    var samenodeName = obj.samenode;
    var name = obj.name;
    // 1. 确保 samenode 节点存在，并且 不能是主节点或者已经是其他节点的同义词
    return ensureKnode({
        name:samenodeName
    })
    .then(data =>{
      if(data){
          var _samenodeName = data.samenode;
          if(_samenodeName){
              if(_samenodeName == name){
                  throw new SameNodeError(`此节点已被添加为同义词`)
              }else{
                  throw new SameNodeError(`此节点是${_samenodeName}的同义词`)
              }
          }else{
              throw new SameNodeError(`此节点是主节点，不能作为同义词`)
          }
      }else{
          upsertKnode({
            name:samenodeName,
            samenode:name
          })
      }

    })
    .then(data=>{
        console.log('创建/更新同义词成功')
        ctx.status = 200;
        ctx.jsonp = {msg:'addSameNode',code:0};
    })
    .catch(err=>{
        ctx.status = 200;
        console.log(err)
        ctx.jsonp  = {
          msg:err.toString(),
          code:err.code || -1
        }
    })

}
module.exports = addSameNode
