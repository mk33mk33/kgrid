<template>
  <section class="knode-intro" v-show = "knode.name">
        <div class="knode-card">
            <span class="knode-nodename" v-text = "knode.name"></span>
            <span class="knode-bd-op">编辑</span>
        </div>
      <div class="knode-content" v-if = "knode.parents && knode.parents.length">
          <div class="knode-part">
              <span>所属分支</span>
              <span class="knode-right-op">收起</span>
          </div>
          <div class="knode-article">
              <a v-for = "node in knode.parents" :href = "'//maiev.org/knode.html?name='+node" v-text="node"></a>
          </div>
      </div>
      <div class="knode-content" v-if = "knode.children && knode.children.length">
          <!-- 正文要解析md语法 -->
          <div class="knode-part">
              <span>下级分支</span>
              <span class="knode-right-op">收起</span>
          </div>
          <div class="knode-article">
              <a v-for = "node in knode.children" :href = "'//maiev.org/knode.html?name='+node" v-text="node"></a>
          </div>
      </div>
      <div class="knode-content" v-if = "knode.brother && knode.brother.length">
          <!-- 正文要解析md语法 -->
          <div class="knode-part">
              <span>相关节点</span>
              <span class="knode-right-op">收起</span>
          </div>
          <div class="knode-article">
              <a v-for = "node in knode.brother" :href = "'//maiev.org/knode.html?name='+node" v-text="node"></a>
          </div>
      </div>

      <!-- 弱相关 -->
      <!-- 网络结构图 -->
      <div class="knode-content">
          <!-- 正文要解析md语法 -->
        <div class="knode-part">
          <span>简介</span>
          <span class="knode-right-op">收起</span>
        </div>
        <div class="markdown-container" v-html = "knode.contentHTML"></div>
      </div>
      <div class="knode-content"  v-if = "knode.karticles && knode.karticles.length">
          <!-- 关联的文章 -->
          <div class="knode-part">
            <span>相关文章</span>
            <span class="knode-right-op">收起</span>
          </div>
          <div class="knode-article">
              <a v-for = "node in knode.karticles" :href = "node.link" v-text="node.title"></a>
          </div>
      </div>
      <div class="knode-content" v-if = "crawlList && crawlList.length">
          <!-- 从爬虫搜索来的数据 -->
          <div class="knode-part">
            <span>推荐阅读</span>
            <span class="knode-right-op">收起</span>
          </div>
          <div class="knode-article">
              <a v-for = "node in crawlList" :href = "node.Url" v-text="node.main1" :time="item.updated_at"></a>
          </div>
      </div>
  </section>
</template>
<script>

import XFetch from '../utils/fetch'
import {getUrlParams} from '../utils/tools'
var MarkdownIt = require('markdown-it');
var md = new MarkdownIt();
export default {
  data:function() {
    return {
      knode:{},
      crawlList:[]
    }
  },
  created:function(){

      var name = getUrlParams('name')
      if(name){
          XFetch("get",`wikiapi/knode?name=${encodeURIComponent(name)}`,null,data => {
              console.log('@@@@local',data)
              if(data&&data.data){
                if(data.data.content)data.data.contentHTML = md.render(data.data.content)
                this.knode = data.data
              }
              console.log(this.knode)
          })
          XFetch("get",`api/cm/feed?limit=20&keyword=${name}`,null,data => {
              console.log(data);
              this.crawlList = data
        })
      }

  },
  methods:{
    fmtDate:function(str){
        return new Date(str).toLocaleDateString()
    },
    expand:function(item){
        if(item.expand)return item.expand = false
        console.log('展开文章',item)
        Vue.set(item,'expand',true)
        if(!item.content){
            XFetch("get","api/cm/blog/"+encodeURIComponent(item.title),null,function(data){
                console.log('##',data.content)
                Vue.set(item,'content',data.content)
                Vue.set(item,'html',md.render(data.content))
            })
        }
    },
    fold:function(item){
        console.log('收起')
        item.expand = false
    }
  }
}
</script>
