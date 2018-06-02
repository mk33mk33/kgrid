<template>
  <!-- popup -->
  <div v-show = "params.show">
      <div  class="knode-editor-mask">
          <div class="dialog shadow-on knode-editor-dialog">
              <div class="dialog-title" v-text="params.title || '提示'">Use Windows location service?</div>
              <div class="dialog-content">
                  <div v-if = "params.text !== undefined" v-text = "params.text"></div>
                  <input v-if = "params.input !== undefined" v-model = "params.input" type="text">
              </div>
              <div class="dialog-actions text-right">
                  <template v-if = "params.action">
                      <button v-for = "item in params.action" v-text = "getText(item)" @click = "callback(item)" class="button js-dialog-close alert">Agree</button>
                  </template>
                  <template v-else>
                      <button @click = "callback()" class="button js-dialog-close alert">关闭</button>
                  </template>
              </div>
          </div>
      </div>
      <div class="overlay" style="background: rgba(0, 0, 0, 0.5);"></div>
  </div>
  <!-- popup -->
</template>

<script>
export default {
  name: 'kdialog',
  props: {
    params: Object
  },
  data:function() {

  },
  created:function(){

  },
  methods:{
      getText:function(item){
          if(!item)return ''
          if(typeof item == 'string')return item
          return item.text
      },
      callback:function(item){
          console.log(item)
          if(!item || typeof item == 'string'){
              this.params.show = false  // 默认的行为是关闭对话框
          }else {
              item.cb(this.params)
          }

      }
  }
}


</script>
