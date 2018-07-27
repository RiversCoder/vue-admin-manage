<template>
    <div class="loginContainer" ref="menuScroll">
       <el-container>
          <el-header class="header" height="70px">
              <img src="~common/images/logo@250x250.png" class="logo" />
          </el-header>
          <el-main class="content">
              <div class="formBox">
                  <form method="get" action="">
                    
                    <h3 class="loginTitle"> 登录 </h3>
                    
                    <el-input v-model="email" placeholder="Email" type="email" class="inputs" name="user_name"></el-input>  
                    <el-input v-model="password" placeholder="Password" type="password" class="inputs" name="user_password" id="loginUbmit"></el-input> 
                    <el-input  @click.native="loginfn" value="Login" type="button" class="inputs submit" ></el-input> 
                    
                    <!-- <a class="forgetInfo" href="javascript:;" @click="forgetpw">忘记密码?</a> -->

                  </form>
              </div>
          </el-main>
        </el-container>
    </div>
</template>

<script type="text/javascript">
    
    import qs from 'qs';
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import tool from 'common/js/tool.js';
    import wt from './wt.js';

    export default {
      data() {
        return {
          email: '',
          password: '',
          url: this.$baseUrl+'/api/login',
          get_current_program: this.$baseUrl+'/api/getLastShow'
        }
      },
      methods:{
        //初始化当前的节目
          initCurrentProgram(){
             if(!tool.sget('initOnoff')){
                   //3. 节目请求
                  this.$axios.post(this.get_current_program).then((res)=>{

                     if(res.data.status == 'success'){
                          //获取数据
                          //
                          //根据已有资源重组
                          //var cd = wt.formatData(JSON.parse(res.data.data));

                          //设置本地存储
                          //tool.setCurrentProgram(cd);

                          //this.$router.go(0);
                          //location.reload();
                     }
                  })

                  tool.sset('initOnoff',true);
             }  

          },
        loginfn(){
          
          this.$axios.post(this.url,qs.stringify({
            'name': this.email,
            'password': this.password
          }),{
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((res)=>{
            this.loginCheck(res.data);
          }).catch((err)=>{
            console.log(err)
          });
        },
        loginCheck(res){  
          
          
          if(res.status == 'success'){
            //写入vuex状态树中
            this.setToken(res.data[0].token);
            //把节目写入本地数据
            //this.initCurrentProgram();
            //去到首页
            this.$router.push({'path':'/home'})

          }else{
            //弹出提示信息 登陆失败
            this.$message.error(res.message);
          }
        },
        initEnterEvent(){
          var This = this;
          $('#loginUbmit').keydown(function(e){
            if(e.keyCode == 13){
              This.loginfn();
            }
          }); 

        },  
        forgetpw(){
          this.$router.push({'path':'/reset'})
        },
        ...mapMutations({
            setToken: 'login'  
        }),
        //初始化滚动包裹盒子的高度
        initScrollHeight(){
            
              let wrap = this.$refs.menuScroll;
              wrap.style.overflow = 'hidden';
              
              let headHeight = 0;
              function fn(){
                  let winHeight = document.body.offsetHeight;
                  wrap.style.height = (winHeight - headHeight) + "px";
              }
              fn();
              window.addEventListener('resize',fn);
        }
      },
      mounted(){
        this.initScrollHeight();
        this.initEnterEvent();
      }
    }


</script>



<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
    
    .loginContainer
        whp(100%,100%);bgColor(#fff);rp();
        
        .header
            whn(100%,70px);border-bottom:12px solid #f0b551;bgColor(#000);padding:0;box-sizing: content-box;
            .logo
                @extend .block;whn(60px,auto);ab(20%,5px);
        .content
            whp(100%,100%);ab(0,82px);bottom:0;right:0;mpInit();@extend .block; 
            .loginTitle
                height:217px;line-height:280px;text-align:center;font-size:25px;font-weight:bold;color:#333;
            .inputs
                @extend .block; width:356px;margin:0 auto;
                &:nth-of-type(2)
                    margin-top:25px;
                input
                    margin-top:0;height:48px;line-height:48px;border-radius:10px;bgColor(rgba(244,244,244,1));color:#999;border:1px solid #DEDEDE;out-line:none;
                    &:hover
                      opacity:0.8;
            .submit
                height:53px;margin-top:54px;  
                .el-input__inner
                        hh(53px);background-color:#f0b551 !important;color:#fff;font-size:21px;cursor:pointer;
            .forgetInfo
                @extend .block; width:356px;margin:0 auto;font-size:16px;color:#999;margin-top:19px;text-align:left;text-indent:20px;
                &:hover
                    text-decoration:underline;
    
                                           
</style>

<style type="text/css">
    @media screen and (max-width: 800px){
        .loginContainer .header .logo{
            left:50%;
            margin-left:-66px;
        }
    }

    .submit .el-input__inner{
      background-color:#f0b551 !important;height:54px;line-height:54px;color:#fff;font-size:21px;cursor:pointer;border-radius:10px;
    }
    .submit .el-input__inner:hover{
      opacity: .8;
    }                 
</style>