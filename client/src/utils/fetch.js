function XFetch(method,url,data,cb){
  var sendData;
  if(method == "get"){
      var p = []
      if(data){
          Object.keys(data).forEach(key=>{
            p.push(`${key}=${data[key]}`)
          })
        url = `${url}?${p.join('&')}`
      }
  }else{
      sendData = JSON.stringify(data)
  }
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
      if (xhr.readyState == 4){
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
              var data = JSON.parse(xhr.responseText);
              console.log(`==>> ${url} ==>>`,data)
              cb(data)
          } else {
              console.log("Request was unsuccessful: " + xhr.status);
              cb({code:xhr.status,msg:`获取数据错误:${xhr.status}`})
          }
      }
  };
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
  xhr.send(sendData);
}
export default XFetch
