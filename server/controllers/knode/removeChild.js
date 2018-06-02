// 已确保节点存在，删除子节点关联关系
var ensureKnode = require('../../service/ensureKnode')
var upsertKnode = require('../../service/upsertKnode')
var SameNodeError = require('../../error').SameNodeError
function removeChild (ctx) {
    var obj = ctx.request.body;
    var childName = obj.child;  // 注意不能添加到同义词节点上，要添加到主节点上
    var name = obj.name;
    // 1. 确保 子节点存在并且不是一个同义词节点
    // 2. 更新主节点
    return ensureKnode({
        name:childName
    })
    .then(data=>{
        // 同义词不能做子节点 父节点不能做子节点
        // 这里有问题  不光是父节点不能作为子节点，在父节点链路上的节点都不能作为子节点 TODO  需要能速查链路
        if(data && data.samenode){
            throw new SameNodeError('同义词不能作为子节点')
        }else{
            // 子节点添加所属
            return upsertKnode({
                name:childName,
                parents:[name]
            })
        }
    })
    .then(data=>{
        return upsertKnode({
            name:name,
            children:[childName]
        })
    })
    .then(data=>{
        console.log('分支节点取消关联成功')
        ctx.status = 200;
        ctx.jsonp = {msg:'removeChild',code:0};
    })
    .catch(err=>{
        ctx.status = 200;
        ctx.jsonp  = {
          msg:err.toString(),
          code:err.code || -1
        }
    })

}
module.exports = removeChild
