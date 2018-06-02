var getKnode = require('../../service/getKnode')
function isExist (ctx,next) {
    console.log(ctx.request.method)
    var method = ctx.request.method;
    var obj = ctx.request.query;
    if(method == "POST"){
        obj = ctx.request.body;
    }
    console.log('isExist >>',obj)
    if(!obj || !obj.name){
        ctx.status = 200;
        ctx.jsonp = {
          errcode:-1,
          msg:'参数错误'
        }
        return
    }
    var name = obj.name
    return getKnode({name:name}).then(data=>{
        if(data){
            return next()
        }else{
            console.log('节点不存在',name)
            ctx.status = 200;
            ctx.jsonp  = {
              msg:'knode not found',
              code:-2
            }
            return
        }
    })
    .catch(err=>{
        console.log('查询知识节点失败',err)
        ctx.status = 200;
        ctx.jsonp  = {
          msg:err.toString(),
          code:-3
        }
    })
}
module.exports = isExist
