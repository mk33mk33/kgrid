// 创建空的新节点，如果节点已存在，返回错误码
var getKnode = require('../../service/getKnode')
var ensureKnode = require('../../service/ensureKnode')
var NodeExistError = require('../../error').NodeExistError
function createKnode (ctx) {
    var obj = ctx.request.body;
    var content = obj.content;
    var name = obj.name;
    return getKnode({
        name:name
    })
    .then(data=>{
        if(data){
            throw new NodeExistError('节点已存在')
        }else{
            return ensureKnode({
              name:name
            })
        }
    })
    .then(data=>{
        console.log('创建节点成功')
        ctx.status = 200;
        ctx.jsonp = {msg:'createKnode',code:0};
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
module.exports = createKnode
