#!/usr/bin/env node

// 读取文件，解析出文章数据 提交到服务器
var Fs = require('fs-extra');
var request = require('superagent');
var Path = require('path')
var argv = process.argv
// console.log(argv)
if(argv.length < 2){
    console.log('参数错误')
}else {
    var p = argv[2]
    var filePath = Path.resolve(__dirname,p)
    // console.log(filePath)
    Fs.readFile(filePath).then(data=>{
        // console.log(data.toString())
        var str = data.toString();
        var seg = str.split(/\n={5,}\n/);
        if(seg.length>=2){
            var metaStr = seg[0]
            var content = seg.slice(1).join("=====").trim()
            var metaObj = {}
            metaStr.split(/\n+/).map(s=>{
                if(s.match(':')){
                    var mp = s.split(':')
                    metaObj[mp[0]] = mp.slice(1).join(':').trim()
                }
            });
            if(metaObj.name && metaObj.root){
                console.log(`知识节点: ${metaObj.name}, 所属分支: ${metaObj.root}`)
                request
                // .post('http://maiev.org/wikiapi/knode')  // 废弃
                .send({
                    name:metaObj.name,
                    root:metaObj.root,
                    content:content
                })
                .end((err,res)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log('提交成功')
                    }
                })

            }else if(metaObj.title && metaObj.root){
                console.log(`文章: ${metaObj.title}, 所属分支${metaObj.root}`)
                request
                .post('http://maiev.org/wikiapi/karticle')
                .send({
                    name:metaObj.title,
                    root:metaObj.root,
                    content:content
                })
                .end((err,res)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log('提交成功')
                    }
                })
            }
        }
    })
    .catch(err=>{
        console.log(err)
    })
}
