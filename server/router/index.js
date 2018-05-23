const router = require('koa-router')();
var kc = require("../controllers/knode");
module.exports = function(app){

    // ping
    router.get('/wikiapi/ping',ctx => {
        ctx.status = 200;
        ctx.jsonp = {msg:'wikiapi'};
    })
    // knode 增删改查
    router.post('/wikiapi/knode', kc.upsertKnode);
    // router.get('/wikiapi/knode', kc.getKnode);
    // router.put('/wikiapi/knode', kc.updateKnode);
    // router.delete('/wikiapi/knode', kc.deleteKnode);


    app.use(router.routes());
}
