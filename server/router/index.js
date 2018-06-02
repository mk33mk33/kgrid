const router = require('koa-router')();
var createKnode = require("../controllers/knode/createKnode");
var getKnode = require("../controllers/knode/getKnode");
var isExist = require("../controllers/knode/isExist");
var addSameNode = require("../controllers/knode/addSameNode");
var addParent = require("../controllers/knode/addParent");
var addChild = require("../controllers/knode/addChild");
var updateContent = require("../controllers/knode/updateContent");
var getSameNode = require("../controllers/knode/getSameNode");
module.exports = function(app){
    // ping
    router.get('/wikiapi/ping',ctx => {
        ctx.status = 200;
        ctx.jsonp = {msg:'wikiapi'};
    })
    // knode 增删改查
    router.post('/wikiapi/createknode', createKnode);
    router.get('/wikiapi/knode', getKnode);
    // router.delete('/wikiapi/knode', kc.deleteKnode);
    // 添加同义词
    router.post('/wikiapi/addsamenode', isExist, addSameNode);
    // // 添加所属节点
    router.post('/wikiapi/addparent', isExist, addParent);
    // // 添加分支节点
    router.post('/wikiapi/addchild', isExist, addChild);
    // // 添加文章
    // router.post('/wikiapi/addkarticle', isExist, addKarticle);
    // // 更新简介
    router.post('/wikiapi/updatecontent', isExist, updateContent);
    // 查找同义词
    router.get('/wikiapi/samenode', getSameNode);
    // // 查找文章
    // router.get('/wikiapi/findkarticle',  findKarticle)
    app.use(router.routes());
}
