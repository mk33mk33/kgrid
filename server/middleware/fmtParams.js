module.exports = function () {
  return async function fmtParams(ctx,next) {
      // console.log('格式化url参数',ctx.query,ctx.request.query)
      var obj = ctx.query || {}
      Object.keys(obj).forEach(key=>{
          obj[key] = decodeURIComponent(obj[key])
      })
      await next()  // 必须await next()
  }
}
