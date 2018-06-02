// 创建一个知识节点
// 小写去空格作为name,首先要查找是否有相同节点
var ensureKnode = require('../../service/ensureKnode')
var addChildren = require('../../service/addChildren')
var addParents = require('../../service/addParents')
var upsertKnodeService = require('../../service/upsertKnode')


function upsertKnode (ctx,next) {

    console.log(ctx.request.body)
    var obj = ctx.request.body;
    // 1. 验证数据字段，必须有节点名或者 alias ，alias必须格式化
    if(!obj || !obj.name){
        ctx.status = 200;
        ctx.jsonp = {
          errcode:-1,
          msg:'参数错误'
        }
        return
    }
    var ps = []
    var name = obj.name
    var key = name.trim().toLowerCase()
    var parents = obj.root ? obj.root.split(',') : []
    var children = obj.children ? obj.children.split(',') : []
    // 2. 检查父节点,并给父节点增加此节点作为子节点
    ps.concat(parents.map(s=>{
        return addChildren({
          name:s.trim(),
          children:[name]
        })
    }))

    // 3. 检查子节点，并给子节点增加此节点作为父节点
    ps.concat(children.map(s=>{
        return addParents({
          name:s.trim(),
          parents:[name]
        })
    }))

    // 4. 父子节点确认后才能确认兄弟节点,最后要合并兄弟节点

    return Promise.all(ps)
    .then(data => {
        return Promise.all(parents.map(s=>{
            return ensureKnode({name:s.trim()}).then(data=>{
                var ret = {}
                var data = data || {}
                ret[s.trim()] = data.children || [];
                return ret
            })
        }))
    })
    .then(data => {
        console.log('%%%%%%%%',data)
        var node = {
            name:name,
            parents:parents,
            children:children,
            content:obj.content,
            karticles:obj.karticles,
            related:obj.related,
            samenode:obj.samenode
        }
        // node.brother = data.map(item=>{
        //     var ret = []
        //     if(item){
        //         var p = Object.keys(item)[0]
        //         var v = item[p]
        //         var i = v.indexOf(key)
        //         if(i!=-1){
        //             v.splice(i,1)
        //         }
        //         ret = v.map(s=>{
        //             return `${p}::${s}`
        //         })
        //     }
        //     return ret;
        // }).reduce((a1,a2)=>{
        //     return a1.concat(a2)
        // })
        // console.log('检查reduce后的兄弟节点',node.brother)

        return upsertKnodeService(node)
    })
    .then(data=>{
        console.log('创建/更新知识节点成功')
        ctx.status = 200;
        ctx.jsonp = {msg:'upsertKnode',code:0};
    })
    .catch(err=>{
        console.log('创建/更新知识节点失败',err)
        ctx.status = 200;
        ctx.jsonp  = {
          msg:err.toString(),
          code:-1
        }
    })
}
module.exports = upsertKnode;
