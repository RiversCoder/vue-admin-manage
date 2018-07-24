<template>
  <div id="app">
      <div  ref="allWrapBox">
        <router-view />
      </div>
  </div>
</template>

<script>
    
    import event from 'common/js/event'

    export default {
      name: 'App',
      methods:{
        initHeight(){
          var box = this.$refs.allWrapBox;
          function fn(){
            box.style.height = document.documentElement.clientHeight + 'px';
          }
          fn();
          event.resize(fn);
        }
      },
      mounted(){
        //this.initHeight();
      }
    }
</script>

<style lang="stylus" rel='stylesheet/stylus'>
    #app
        width:100%;height:100%;overflow-x:hidden;
    .el-button--primary
        background-color: #f0b551 !important;
        border-color: #f0b551 !important;    
</style>
