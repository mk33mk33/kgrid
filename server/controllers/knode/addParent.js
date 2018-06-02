// 已确保节点存在，添加父节点
var ensureKnode = require('../../service/ensureKnode')
var upsertKnode = require('../../service/upsertKnode')
var SameNodeError = require('../../error').SameNodeError
function addParent (ctx) {
    var obj = ctx.request.body;
    var parentName = obj.parent;  // 注意不能添加到同义词节点上，要添加到主节点上
    var name = obj.name;
    // 1. 确保 父节点存在并且不是一个同义词节点
    // 2. 更新主节点
    return ensureKnode({
        name:parentName
    })
    .then(data=>{
        // 这里有问题  不光是子节点不能作为父节点，在子节点链路上的节点都不能作为父节点 TODO  需要能速查链路
        if(data && data.samenode){
            throw new SameNodeError('同义词不能作为父节点')
        }else if(data && data.parents.indexOf(name) != -1){
            throw new SameNodeError('子节点不能作为父节点')
        }else{
            // 父节点添加分支
            return upsertKnode({
                name:parentName,
                children:[name]
            })
        }
    })
    .then(data=>{
        return upsertKnode({
            name:name,
            parents:[parentName]
        })
    })
    .then(data=>{
        console.log('创建/更新所属节点成功')
        ctx.status = 200;
        ctx.jsonp = {msg:'addParent',code:0};
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
module.exports = addParent
