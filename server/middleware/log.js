// 日志 try next 日志

/*
 * Tokens:
 *
 *   - `:req[header]` ex: `:req[Accept]`
 *   - `:res[header]` ex: `:res[Content-Length]`
 *   - `:http-version`
 *   - `:response-time`
 *   - `:remote-addr`
 *   - `:date`
 *   - `:method`
 *   - `:url`
 *   - `:referrer`
 *   - `:user-agent`
 *   - `:status`
*/
const logpath = require('../config').logpath;
const winston = require('winston');
const logger = new (winston.Logger)({
    level: 'info',
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: logpath || 'wiki.log' })
    ]
  });
const fmt = ':remote-addr - -' +
  ' ":method :url HTTP/:http-version"' +
  ' <:status> :content-length ":referrer"' +
  ' ":user-agent" ":error"';
function getRemoteAddr(ctx){
  return ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips ||
  (ctx.socket && (ctx.socket.remoteAddress || (ctx.socket.socket && ctx.socket.socket.remoteAddress)))
}
function getHTTPVerion(ctx){
  return ctx.req.httpVersionMajor + '.' + ctx.req.httpVersionMinor
}
function getStatus(ctx){
  return ctx.response.status || ctx.response.__statusCode || ctx.res.statusCode
}
function getLevel(ctx){
  var code = getStatus(ctx);
  if(code<500&&code>400)return 'warn'
  if(code>500)return 'error'
  return 'info'
}
module.exports = function () {
  return async function log(ctx,next) {
    //请求开始处理
    // if(!ctx.request.url.match(/^\/legosv5\/registry/)){
    //   console.log('非注册服务器的请求，通过',ctx.request.url);
    //   return next();
    // }
    var error = ''
    logger.log('info',`==>> ${getRemoteAddr(ctx)}- - ${ctx.method} ${ctx.originalUrl} HTTP/${getHTTPVerion(ctx)}`)
    try {
      await next()
    } catch (err) {
      error = JSON.stringify(err.stack);
      throw err;
    }

    //观察到请求处理结束再发一个日志
    var level = getLevel(ctx);
    var combinedTokens = assembleTokens(ctx);
    combinedTokens.push({token:':error',replacement:error});
    logger.log(level, '<<=='+format(fmt, combinedTokens));
  }

}

function assembleTokens (ctx, customTokens) {
  var arrayUniqueTokens = function (array) {
    let a = array.concat()
    for (let i = 0; i < a.length; ++i) {
      for (let j = i + 1; j < a.length; ++j) {
        if (a[i].token == a[j].token) { // not === because token can be regexp object
          a.splice(j--, 1)
        }
      }
    }
    return a
  }
  var defaultTokens = []
  defaultTokens.push({ token: ':url', replacement: ctx.originalUrl })
  defaultTokens.push({ token: ':protocol', replacement: ctx.protocol })
  defaultTokens.push({ token: ':hostname', replacement: ctx.hostname })
  defaultTokens.push({ token: ':method', replacement: ctx.method })
  defaultTokens.push({
    token: ':status',
    replacement: ctx.response.status || ctx.response.__statusCode || ctx.res.statusCode
  })
  defaultTokens.push({ token: ':response-time', replacement: ctx.response.responseTime })
  defaultTokens.push({ token: ':date', replacement: new Date().toUTCString() })
  defaultTokens.push({ token: ':referrer', replacement: ctx.headers.referer || '' })
  defaultTokens.push({ token: ':http-version', replacement: ctx.req.httpVersionMajor + '.' + ctx.req.httpVersionMinor })
  defaultTokens.push({
    token: ':remote-addr',
    replacement: ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips ||
    (ctx.socket && (ctx.socket.remoteAddress || (ctx.socket.socket && ctx.socket.socket.remoteAddress)))
  })
  defaultTokens.push({ token: ':user-agent', replacement: ctx.headers['user-agent'] })
  defaultTokens.push({
    token: ':content-length',
    replacement: (ctx.response._headers && ctx.response._headers['content-length']) ||
    (ctx.response.__headers && ctx.response.__headers['Content-Length']) ||
    ctx.response.length || '-'
  })
  defaultTokens.push({
    token: /:req\[([^\]]+)\]/g,
    replacement: function (_, field) {
      return ctx.headers[field.toLowerCase()]
    }
  })
  defaultTokens.push({
    token: /:res\[([^\]]+)\]/g,
    replacement: function (_, field) {
      return ctx.response._headers
      ? (ctx.response._headers[field.toLowerCase()] || ctx.response.__headers[field])
      : (ctx.response.__headers && ctx.response.__headers[field])
    }
  })

  return arrayUniqueTokens(defaultTokens)
}

function format (str, tokens) {
  for (let i = 0; i < tokens.length; i++) {
    str = str.replace(tokens[i].token, tokens[i].replacement)
  }
  return str
}
