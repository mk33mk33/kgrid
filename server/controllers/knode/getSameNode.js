// 用key查同义词
var getSameNodeService = require('../../service/getSameNode')
function getSameNode (ctx,next) {
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
    return getSameNodeService({name:name}).then(data=>{
      ctx.status = 200;
      ctx.jsonp = {msg:'getSameNode',code:0,data:data};
    })
    .catch(err=>{
        console.log('获取同义词失败',err)
        ctx.status = 200;
        ctx.jsonp  = {
          msg:err.toString(),
          code:-1
        }
    })
}
module.exports = getSameNode
