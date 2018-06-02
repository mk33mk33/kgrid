var upsertKnode = require('../../service/upsertKnode')
function updateContent (ctx) {
    var obj = ctx.request.body;
    var content = obj.content;
    var name = obj.name;
    return upsertKnode({
        name:name,
        content:content
    })
    .then(data=>{
        console.log('创建/更新简介成功')
        ctx.status = 200;
        ctx.jsonp = {msg:'updateContent',code:0,data:data};
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
module.exports = updateContent
