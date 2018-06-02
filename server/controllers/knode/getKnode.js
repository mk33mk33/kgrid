var getKnodeService = require('../../service/getKnode')
var NodeNotFoundError = require('../../error').NodeNotFoundError
function getKnode (ctx,next) {
    var obj = ctx.request.query;
    if(!obj || !obj.name){
        ctx.status = 200;
        ctx.jsonp = {
          errcode:-1,
          msg:'参数错误'
        }
        return
    }
    var name = obj.name
    return getKnodeService({name:name}).then(data=>{
      if(!data){
        throw new NodeNotFoundError('节点不存在')
      }else if(data.samenode){
          // 这里如果是同义词，应该跳转到主节点
          return getKnodeService({name:data.samenode}).then(data=>{
              // 默认主节点肯定存在
              ctx.status = 200;
              ctx.jsonp = {msg:'getKnode',code:0,data:data};
          })
      }else{
          ctx.status = 200;
          ctx.jsonp = {msg:'getKnode',code:0,data:data};
      }
    })
    .catch(err=>{
        console.log('获取知识节点失败',err)
        ctx.status = 200;
        ctx.jsonp  = {
          msg:err.toString(),
          code:-1
        }
    })
}
module.exports = getKnode
