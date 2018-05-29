function getUrlParams (key){
    var s = location.search.slice(1)
    var p = s.split('&')
    var ret = {}
    p.forEach(seg=>{
        var l = seg.split('=')
        if(l.length == 2)ret[l[0]] = l[1]
    })
    if(key)return ret[key]
    return ret;
}

export {
  getUrlParams
}
