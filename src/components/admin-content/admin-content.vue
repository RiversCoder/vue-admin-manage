<template>
    <div>
         <div class="admin-content-container" ref="cbox">
            <div ref="ebox">
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </div>
         </div>  
     </div>
</template>



<script>
    
    import AdminMenu from 'components/admin-menu/admin-menu'

    import event from 'common/js/event'

    export default{
        data(){
            return{
                opt:{
                  barColor:"#959595",   //滚动条颜色
                  barWidth:6,           //滚动条宽度
                  railColor:"#eee",     //导轨颜色
                  barMarginRight:0,     //垂直滚动条距离整个容器右侧距离单位（px）
                  barMaginBottom:0,     //水平滚动条距离底部距离单位（px)
                  barOpacityMin:0.3,      //滚动条非激活状态下的透明度
                  zIndex:"auto",        //滚动条z-Index
                  autohidemode:true,     //自动隐藏模式
                  horizrailenabled:true,//是否显示水平滚动条
                }
            }
        },
        components:{
            
        },
        methods:{
            calcWidth(){
                var This = this;
                var menuWidth = 320;
                var box = This.$refs.cbox;
                var ebox = This.$refs.ebox;

                function fn(){

                    //检测当前的屏幕宽度
                    var cw = window.innerWidth;
                    var ch = window.innerHeight;

                    if(cw > 1024){
                      if(box){
                        var sw = document.body.offsetWidth;
                        var sh = document.body.offsetHeight;
                        box.style.width = cw - menuWidth + 'px';
                        box.style.height = ch + 'px';
                        ebox.style.minHeight = ch + 'px';
                      }
                    }else{
                      var sw = document.body.offsetWidth;
                      ebox.style.minHeight = ch + 'px';
                      box.style.width = sw + 'px';
                      box.style.height = ch + 'px';
                    }
                }
                fn();
                event.resize(fn);
            }
        },
        mounted(){
           this.calcWidth();
        }
    }

</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import '~common/stylus/variable'
    @import "~common/stylus/mixin"
    
    .admin-content-container
       height:100%;position:absolute;width:80%;left:$menuwidth;top:0;height:1080px;background:#fff;
       font-size:30px;box-sizing:border-box;
    @media screen and (max-width:1024px)
      .admin-content-container
         left:0;top:73px;; 
</style>
