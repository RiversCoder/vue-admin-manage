<template>
  <div class="menu-wrap">
    <div class="menu-container menu-pc-container" ref="mcontent" >
        
        <div class="logobox">
            <img src="~common/images/logo@250x250.png" class="logoImg" />
        </div>  
          

        <div class="menuList">
            <ul class="Lists">
                <li class="mitem mitem1">
                    <router-link to="/home">
                        <span class="micon"></span>
                        <span class="mtext">About US</span>
                    </router-link>
                </li>
                <li class="mitem mitem2">
                    <router-link to="/source-manage">
                        <span class="micon"></span>
                        <span class="mtext">资源管理</span>
                    </router-link>
                </li>
                <li class="mitem mitem3">
                    <router-link to="/pc">
                          <span class="micon"></span>
                          <span class="mtext">节目编排</span>
                    </router-link>
                </li>
                <li class="mitem mitem4">
                    <router-link to="/draft-box">
                        <span class="micon"></span>
                        <span class="mtext">草稿箱</span>
                    </router-link>
                </li>
                <li class="mitem mitem5">
                    <router-link to="/store">
                        <span class="micon"></span>
                        <span class="mtext">存储与账号</span>
                    </router-link>
                </li>
                <li class="mitem mitem6">
                    <router-link to="/device-manage">
                        <span class="micon"></span>
                        <span class="mtext">设备管理</span>
                    </router-link>
                </li>
                <li class="mitem mitem7">
                    <router-link to="/help">
                        <span class="micon"></span>
                        <span class="mtext">帮助</span>
                    </router-link>
                </li>
            </ul>
        </div>


        <div class="outLoginbox" @click="logoutFn">
            <span class="outloginimg"></span>
            <span class="outlogintext">退出登录</span>
        </div>
      
        <!-- 弹出信息组件 -->
        <alert-info :content="alertInfo" @cancelBox="closeInfoBox" :dialogVisible="dialogVisible"></alert-info>

      </div>
      
    <div class="menu-container menu-container-mobile" >
        
        <div class="logobox">
            <img src="~common/images/logo@250x250.png" class="logoImg" />
        </div>  
          
        <div class="closeBtnBox " @click="cactiveBtnFunc" ref="closeBtn">
          <span class="cline"></span>
          <span class="cline"></span>
          <span class="cline"></span>
        </div>
        
        <div class="maskWrap"></div>

        <div class="maskBox">
             <div class="menuList" ref="menuList">
              <ul class="Lists">
                  <li class="mitem mitem1">
                      <router-link to="/home">
                          <span class="micon"></span>
                          <span class="mtext">About US</span>
                      </router-link>
                  </li>
                  <li class="mitem mitem2">
                      <router-link to="/source-manage">
                          <span class="micon"></span>
                          <span class="mtext">资源管理</span>
                      </router-link>
                  </li>
                  <li class="mitem mitem3">
                      <router-link to="/pc">
                            <span class="micon"></span>
                            <span class="mtext">节目编排</span>
                      </router-link>
                  </li>
                  <li class="mitem mitem4">
                      <router-link to="/draft-box">
                          <span class="micon"></span>
                          <span class="mtext">草稿箱</span>
                      </router-link>
                  </li>
                  <li class="mitem mitem5">
                      <router-link to="/store">
                          <span class="micon"></span>
                          <span class="mtext">存储与账号</span>
                      </router-link>
                  </li>
                  
                  <li class="mitem mitem7">
                      <router-link to="/help">
                          <span class="micon"></span>
                          <span class="mtext">帮助</span>
                      </router-link>
                  </li>
                  <li class="mitem mitem8" @click="logoutFn">
                        <span class="micon"></span>
                        <span class="mtext">退出</span>
                  </li>
              </ul>
          </div>

        </div>
   

      <!--   <div class="outLoginbox" @click="logoutFn">
          <span class="outloginimg"></span>
          <span class="outlogintext">退出登录</span>
      </div>
            
      弹出信息组件
      <alert-info :content="alertInfo" @cancelBox="closeInfoBox" :dialogVisible="dialogVisible"></alert-info> -->

      </div>
  </div>

</template>

<script>
    import tool from '@/common/js/tool.js'
    import AlertInfo from '@/components/alert-info/alert-info'
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';

    export default{
        data(){
            return {
                show : true,
                isRender : true,
                isCollapse: false,
                dialogVisible: false,
                alertInfo : '确认退出后台?'
            }
        },
        created(){
          /*this.dialogVisible= false
          this.alertInfo = '确认退出后台？'*/
        },
        methods: {
          menuSpread(){
            let elem = this.$refs.mcontent
            elem.style.width = '240px'
          },
          menuCollect(){
            let elem = this.$refs.mcontent
            elem.style.width = '64px'
          },
          exitFunc(){
            this.dialogVisible = true;
          },
          closeInfoBox(){
            this.dialogVisible = false;
          },
          logoutFn(){
            
            this.$alert('是否要退出后台？', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                 if(action == 'confirm'){
                    
                    //清除所有数据
                    tool.lset('file_list_on',[]);
                    tool.lset('file_list_off',[]);
                    tool.lset('file_list_full',[]);

                    tool.lset('time_list_on',[]);
                    tool.lset('time_list_off',[]);
                    tool.lset('time_list_full',[]);

                    tool.sset('initOnoff',false);

                      
                   this.setToken(null);
                   localStorage.setItem('token','');
                   this.$router.push({path:'/login'});

                 }
              }
            });


          },
          initHeight(){
            var imenu = this.$refs.mcontent;

            imenu.style.height = document.body.clientHeight + 'px';
            window.addEventListener('resize',()=>{
               imenu.style.height = document.body.clientHeight + 'px';
            })
           
          },
          ...mapMutations({
            setToken: 'login'
          }),
          cactiveBtnFunc(ev){
             var close = this.$refs.closeBtn;
             var ml = this.$refs.menuList;
             close.classList.toggle('closeBtnBoxActive');

             if(close.classList.contains('closeBtnBoxActive')){
               //菜单移动动画
               ml.style.WebkitTransform = 'translate3d(0,0,0)';
               ml.style.transform = 'translate3d(0,0,0)';
               ml.style.opacity = 1;
             }else{
               //菜单移动动画
               ml.style.WebkitTransform = 'translate3d(0,-450px,0)';
               ml.style.transform = 'translate3d(0,-450px,0)';
               ml.style.opacity = 0;
             }
          },
          //监听鼠标移出
          listener(){
            var ml = this.$refs.menuList;
            var close = this.$refs.closeBtn;
            var its = ml.getElementsByClassName('mitem');

            for(var i=0;i<its.length;i++){
              its[i].addEventListener('click',function(e){
                  close.classList.toggle('closeBtnBoxActive');
                  ml.style.WebkitTransform = 'translate3d(0,-450px,0)';
                  ml.style.transform = 'translate3d(0,-450px,0)';
                  ml.style.opacity = 0;
              });
            }
          }
        },
        computed: {
            
        },
        mounted(){
          this.initHeight();
          this.listener();
        },
        components:{
          AlertInfo
        }
    }
</script>




<style scoped lang="stylus" rel="stylesheet/stylus">
    

    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
    
    
    .menu-container-mobile
      display:none;
     
    .menu-container
        width:$menuwidth;height:1080px;background:$menu-color;transition:.2s ease-in;position:absolute;top:0;bottom:0;bgColor(#F4F4F4);
        
        .outLoginbox
            wh(100%,50px);hh(50px);text-align:center;cursor:pointer;position:absolute;bottom:18px;
            .outloginimg
              @extends .block;wh(32px,32px);bgImg('~common/images/off_sel-icon1.png');ab(85px,9px);
            .outlogintext
              font-size:18px;color:#333;position:relative;left:20px;

        .logobox
            wh(100%,126px);position:relative;
            .logoImg
                @extends .block;wh(110px,auto);ab(50%,50%);transform:translate3d(-50%,-50%,0);
        .menuList 
            wh(100%,auto);position:relative;z-index:100;
                
            .mitem
                list-style:none;width:100%;hh(80px);text-align:left;text-indent:110px;font-size:18px;color:#333;cursor:pointer;position:relative;
                
                //默认active样式
                .menuActive 
                    bgColor(#f0b551);color:#fff;     
                a
                    @extends .block;ab(0,0);wh(100%,100%);transition:.5s;color:#333;
                    
                    .micon
                        @extends .block;content:'';wh(32px,32px);ab(68px,25px);     
                &:hover
                    a
                        bgColor(#f0b551);
                .mtext
                  font-size:17px;position:relative;top:2px;left:10px;
            .mitem1
                .menuActive
                    .micon
                        bgImg('~common/images/dbs_copy@2x.png');
                .micon
                    bgImg('~common/images/dbs@2x.png');
                
            .mitem2
                .menuActive
                    .micon
                        bgImg('~common/images/source_copy@2x.png');
                .micon
                    bgImg('~common/images/source@2x.png');
            
            
            .mitem3
                .menuActive
                    .micon
                        bgImg('~common/images/caogao_copy@2x.png');
                .micon
                    bgImg('~common/images/caogao@2x.png');
                        

            .mitem4
                .menuActive
                    .micon
                        bgImg('~common/images/store_copy@2x.png');
                .micon
                    bgImg('~common/images/store@2x.png');
                        

            .mitem5
                .menuActive
                    .micon
                        bgImg('~common/images/source_manage_copy@2x.png');
                .micon
                    bgImg('~common/images/source_manage@2x.png');

            .mitem6
                .menuActive
                    .micon
                        bgImg('~common/images/lilv_copy@2x.png');
                .micon
                    bgImg('~common/images/lilv@2x.png');
                                                                
            .mitem7
                .menuActive
                    .micon
                        bgImg('~common/images/help_copy@2x.png');
                .micon
                    bgImg('~common/images/help@2x.png');

            .mitem8
                .menuActive
                    .micon
                        bgImg('~common/images/off_sel_icon.png');
                .micon
                    bgImg('~common/images/off_icon.png');  
    .menu-pc-container
      position:fixed;left:0;top:0;bottom:0;                 

        /*.el-menu-item-group__title
            padding:0
        .el-menu-vertical-demo
            &:not(.el-menu--collapse) 
                width: $menuwidth;
                min-height: 400px;
        .el-menu
            border-right:1px solid rgba(0,0,0,0)
            .el-icon-menu-custom
               @extends .block;wh(38px,38px);bgImg('~common/images/dbs_copy@2x.png'); ab(10px,10px);
        .el-menu-item, .el-submenu__title
            height:90px;line-height:90px;text-align:center;font-size:18px;*/     
</style>


<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
    

      

    @media screen and (max-width: 1350px)
      .menu-container
        width:$menuwidth;
        .menuList 
          .mitem
            height:60px;line-height:60px;
            a 
              .micon
                top:16px;
            .mtext
              font-size:16px;    

    @media screen and (max-width: 1025px)
      .menu-container
        display: none;
      .menu-container-mobile
        display:block;width:100%;line-height:73px;height:73px;position:relative;z-index:12;
        .logobox
          width:102px;height:30px;ab(30px,20px);z-index:3;
          .logoImg
            width:60px;height:auto;ab(10px,50%);transform:translateY(-50%) translateX(0);
        .maskWrap
          width:100%;height:100%;ab(0,0);bgColor(#F4F4F4);z-index:2;
        .maskBox
          width:100%;height:100%;ab(0,0);bgColor(#F4F4F4);z-index:1; 
          .menuList
            ab(0,73px);bgColor(rgba(244,244,244,0.96));transform:translate3d(0,-450px,0);transition:.8s ease;   
            .Lists
             .mitem
               width:100%;hh(50px);
               .micon
                 wh(23px,23px);ab(68px,13px);
               .mtext
                 top:0px;text-indent:0; 
               .menuActive 
                  bgColor(rgba(240,181,81,0.6));color:#fff;
               
        .closeBtnBox
           wh(38px,32px);position:absolute;top:20px;right:28px;z-index:3;cursor:pointer;
           .cline
             @extends .block;width:100%;height:5px;background:#f0b551;border-radius:2px;margin-top:8px;transition:.3s;
             &:nth-of-type(1)
               margin-top:0;         
        .closeBtnBoxActive   
            .cline
              transform-origin:center;transition:.8s;-webkit-transition:.8s;
              &:nth-of-type(1)
                transform:rotate3d(0,0,1,45deg) translate3d(8px,10px,0);
              &:nth-of-type(2)
                opacity:0; 
              &:nth-of-type(3)
                transform:rotate3d(0,0,1,-45deg) translate3d(8px,-10px,0);
      

    @media screen and (max-height:730px)
     .menu-container
        .menuList 
          .mitem
            height:45px;line-height:45px;
            a 
              .micon
                wh(20px,20px);top:15px;
            .mtext
              font-size:14px;
        .outLoginbox
          bottom:15px;hh(42px);
          .outloginimg
            wh(25px,25px);
          .outlogintext
            font-size:15px;left:10px;       

</style>