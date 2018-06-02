<template>
  <section class="knode-editor-container">
      <div class="knode-editor-item">
          <div class="knode-editor-nav">
              <span>当前操作:</span>
              <span v-if = "mode == 'create'">创建节点</span>
              <span v-if = "mode == 'loading'">加载数据</span>
              <span v-if = "mode == 'edit'">编辑节点</span>
          </div>
      </div>
    <template v-if = "mode == 'create'">
        <div class="knode-editor-item">
            <span class = "knode-editor-label">节点名:</span>
            <input type="text" v-model="knode.name" placeholder="节点名称" class = "knode-editor-nodename">
        </div>
        <div>
            <button @click="createKnode" class = "knode-editor-btn button drop-shadow">确认</button>
        </div>
    </template>
    <template v-if = "mode == 'loading'">
        <div class="knode-editor-item">
            数据加载中.....
        </div>
    </template>
    <template v-if = "mode == 'error'">
        <div class="knode-editor-item" v-text = "'加载数据出错' + errormsg"></div>
    </template>
    <template v-if = "mode == 'edit'">
      <div class="knode-editor-item">
          <span class = "knode-editor-label">节点名:</span>
          <input type="text" v-model="knode.name" placeholder="节点名称" class = "knode-editor-nodename" disabled="disabled">
      </div>
      <hr class="knode-editor-hr">
      <div class="knode-editor-item">
          <div>
              <button @click="addSameNode" class = "knode-editor-btn button drop-shadow">添加同义词</button>
          </div>
          <div>
              <div class="knode-editor-xnode" v-for = "item in knode.samenodes">
                  <a v-text = "item.name"></a>
                  <div class="knode-editor-close"></div>
              </div>
          </div>
      </div>
      <hr class="knode-editor-hr">
      <div class="knode-editor-item">
          <div>
              <button @click="addParent" class = "knode-editor-btn button drop-shadow">添加所属节点</button>
          </div>
          <div>
              <div class="knode-editor-xnode"  v-for = "item in knode.parents">
                  <a v-text = "item"></a>
                  <div class="knode-editor-close"></div>
              </div>

          </div>
      </div>
      <hr class="knode-editor-hr">
      <div class="knode-editor-item">
          <div>
              <button @click="addChild" class = "knode-editor-btn button drop-shadow">添加分支节点</button>
          </div>
          <div>
              <div class="knode-editor-xnode"   v-for = "item in knode.children">
                  <a v-text = "item"></a>
                  <div class="knode-editor-close"></div>
              </div>
          </div>
      </div>
      <hr class="knode-editor-hr">
      <div class="knode-editor-item">
          <div class="knode-editor-item">
              <span class = "knode-editor-label">简介</span>
          </div>

          <div class="knode-editor-codemirror">
            <div class="knode-md-toolbar">
                <input class = "knode-md-btn button" type="button" value="保存" @click="saveContent">
                <input class = "knode-md-btn button" type="button" value="上传图片">
            </div>
              <codemirror v-model="knode.content" :options="cmOption"></codemirror>
          </div>
      </div>
      <hr class="knode-editor-hr">
      <div class="knode-editor-item">
          <div>
              <button class = "knode-editor-btn button drop-shadow">添加文章</button>
          </div>
          <div>
              <div class="knode-editor-karticle">
                  <a>网络基础</a>
                  <div class="knode-editor-close"></div>
              </div>
              <div class="knode-editor-karticle">
                  <a>网络基础</a>
                  <div class="knode-editor-close"></div>
              </div>
          </div>
      </div>
      <div class="knode-editor-foot"></div>
    </template>
    <template v-if = "popdata">
      <kdialog :params = "popdata"></kdialog>
    </template>
  </section>
</template>
<script>
// !!!!!坑爹x2
// 1. import 的 codemirror/mode/markdown/markdown.js 会被treeshake掉
// 2. md中已空格开头的行会被解析为注释
// 文档 http://codemirror.net/mode/markdown/index.html
import codemirror  from 'vue-codemirror/src/codemirror.vue'
import kdialog from './kdialog.vue'
import XFetch from '../utils/fetch'
import {getUrlParams} from '../utils/tools'
var X = require('codemirror/mode/markdown/markdown.js')
var MarkdownIt = require('markdown-it');
var md = new MarkdownIt();
export default {
  components: {
    codemirror,
    kdialog
  },
  data:function() {
    return {
      cmOption: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: false,
          lineWrapping: false,
          line: true,
          mode: 'text/x-markdown',
          theme: 'solarized light',
        },
        popdata:{},
        knode:{
          name:'',
          content: '',
          samenodes:[],
          parents:[],
          children:[],
          karticles:[]
        },
        mode:'create', // loading , edit , error
        errormsg:''
    }
  },
  created:function(){
      var name = getUrlParams('name')
      if(name){
          this.mode = 'loading'
          XFetch("get",`wikiapi/knode`,{
              name:name,
          },data => {
              if(data.code == 0){
                this.mode = 'edit'
                this.knode.content = data.data.content
                this.knode.name = data.data.name
                this.knode.parents = data.data.parents
                this.knode.children = data.data.children
                // 获取同义词
                XFetch("get",`wikiapi/samenode`,{
                    name:name,
                },data => {
                    if(data.code == 0){
                        console.log('1111111',data)
                        this.knode.samenodes = data.data;
                    }
                })
              }else{
                this.mode = 'error'
                this.errormsg = data.msg
              }
          })
      }

  },
  methods:{
    createKnode:function(){
         var name = this.knode.name;
         if(name){
             XFetch("post",`wikiapi/createknode`,{
                 name:name,
             },data => {
                console.log('#####',data)
                if(data.code == 0){
                    this.popup({
                      'text':'添加成功',
                      action:[{
                          text:'确认',
                          cb:function(){
                              location.href = `//maiev.org/knode-editor.html?name=${encodeURIComponent(name)}`
                          }
                      }]
                    })
                }else if(data.code == -103){
                    this.popup({
                        'text':'节点已存在',
                        action:['返回',{
                          text:'编辑此节点',
                          cb:function(){
                              location.href = `//maiev.org/knode-editor.html?name=${encodeURIComponent(name)}`
                          }
                        }]
                    })
                }else{
                    this.popup(`创建失败:${data.msg}`)
                }
             })

         }

    },
    addSameNode:function(){
        var _this = this
        this.popup({
            title:'添加同义词',
            input:'',
            action:['取消',{ text:'确认',
                cb:function(popdata){
                    console.log(popdata.input);
                    if(popdata.input){
                        XFetch("post",`wikiapi/addsamenode`,{
                            name:_this.knode.name,
                            samenode:popdata.input
                        },data => {
                            if(data.code == 0){
                              _this.popup('添加成功')
                            }else{
                              _this.popup(`添加失败:${data.msg}`)
                            }
                        })
                    }
                }
              }
            ]
        })
    },
    addParent:function(){
        var _this = this
        this.popup({
            title:'添加所属节点',
            input:'',
            action:['取消',{ text:'确认',
                cb:function(popdata){
                    console.log(popdata.input);
                    if(popdata.input){
                        XFetch("post",`wikiapi/addparent`,{
                            name:_this.knode.name,
                            parent:popdata.input
                        },data => {
                            if(data.code == 0){
                              _this.popup('添加成功')
                            }else{
                              _this.popup(`添加失败:${data.msg}`)
                            }
                        })
                    }
                }
              }
            ]
        })
    },
    addChild:function(){
        var _this = this
        this.popup({
            title:'添加分支节点',
            input:'',
            action:['取消',{ text:'确认',
                cb:function(popdata){
                    console.log(popdata.input);
                    if(popdata.input){
                        XFetch("post",`wikiapi/addchild`,{
                            name:_this.knode.name,
                            child:popdata.input
                        },data => {
                            if(data.code == 0){
                              _this.popup('添加成功')
                            }else{
                              _this.popup(`添加失败:${data.msg}`)
                            }
                        })
                    }
                }
              }
            ]
        })
    },
    saveContent:function(){
        if(this.knode.content && this.knode.name){
            XFetch("post",`wikiapi/updatecontent`,{
                name:this.knode.name,
                content:this.knode.content
            },data => {
                if(data.code == 0){
                  this.popup('更新成功')
                }else{
                  this.popup(`更新失败:${data.msg}`)
                }
            })
        }
    },
    popup:function(obj){
        obj = obj || {}
        if(typeof obj == 'string')obj = {text:obj}
        this.popdata = {
            title:obj.title,
            show:true,
            input:obj.input,
            text:obj.text,
            action:obj.action
        }
    }
  }
}
</script>
