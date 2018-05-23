const Koa = require('koa');
const app = new Koa();
const jsonp = require('koa-safe-jsonp');
// const staticServe = require('koa-static');
// const mount = require('koa-mount');
// const resolve = require('path').resolve;
// const staticDirectory = staticServe(resolve(__dirname, '../static'));
const body = require('koa-bodyparser');
// const cors = require('kcors');
//const logger = require('koa-logger');
const router = require('../router');
// const auth = require('../biz/lnpm/middleware/auth.js');
const logger = require('../middleware/log.js');
app.use(logger());
//1. jsonp 后切的jsonp处理
jsonp(app);
//2. 静态资源处理
// app.use(mount('/legosv5/static', staticDirectory));
//3.bodyParser
app.use(body());
//4.cors
// app.use(cors({
//   allowMethods: 'GET,HEAD',
// }));
//5.auth
// app.use(auth());
//6.etag
//7.route
router(app);
app.listen(6030, () => console.log('知识网络注册服务运行中，端口6030'))
module.exports = app;
