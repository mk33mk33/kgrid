function XFetch(method,url,data,cb){
  var s = new FormData();
  if(data)Object.keys(data).forEach(key=>{
      s.append(key,data[key])
  })
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
      if (xhr.readyState == 4){
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
              console.log(xhr);
              cb(JSON.parse(xhr.responseText))
          } else {
              console.log("Request was unsuccessful: " + xhr.status);
          }
      }
  };
  xhr.open(method, url, true);
  xhr.send(s);
}
export default XFetch
