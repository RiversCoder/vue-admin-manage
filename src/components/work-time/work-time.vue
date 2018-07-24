<template>
    
<div>
     <header class="pc-header">
            <ul class="control-menu">
                <router-link to="/program-production/work-time/on">
                     <li class="item worktime">工作時間</li>
                </router-link>
                <router-link to="/program-production/work-time/off">
                     <li class="item notworktime">非工作時間</li>
                </router-link>
                <router-link to="/program-production/work-time/full">
                     <li class="item fullscreen">全屏</li>
                </router-link>
            </ul>
        </header>
    
    
    <div class="content" ref="ccontent">
        
        <!-- 加載工作添加計劃 -->
        <router-view></router-view>
        
    
        <div class="previewWrap">        
           
                <div class="pc-previewWrap">
                    <h3 class="column-title column-title-2" >節目總預覽</h3> 
                    <div class="previewBoxWrap" >
                        <div class="previewBox" >
                            <div class="pbox tubiaobox">
                                
                                <!-- 說明 -->
                                <ul class="introLists" v-show='true'>
                                    <li class="introItem introItem1">工作</li>
                                    <li class="introItem introItem2">非工作時間</li>
                                    <li class="introItem introItem3">非工作時間</li>
                                    <li class="introItem introItem4">無視頻展示</li>
                                </ul>
                                
                                <!-- 柱狀圖展示 -->
                                <div class="chartViewBox">
                                    <histogram :onOff="showLines"></histogram>
                                </div>
                                
                                <!-- 收藏、上線按鈕 -->
                                <div class="collectionBtn">
                                    <el-button plain class="rbtn resetBtn" @click="reset">重置</el-button>
                                    <el-button plain class="rbtn colectBtn" @click="goup">收藏</el-button>
                                    <el-button plain class="rbtn uploadFile" @click="entry">上線</el-button>
                                </div>    
                                
                            </div>
                            <div class="pbox gamebox" >
                                <h3 class="column-title column-title-2 column-title-gameControl" >遊戲控制</h3>      
                                <div class="gamebox-game">
                                    <div class="gamebox-header">
                                        <span class="gh-title">遊戲開關</span>
                                        
                                        <!-- 遊戲開關按鈕 -->
                                        <div class="gameOnoffBtn">
                                            <el-button plain class="rbtn uploadFile" @click="openGame">打開</el-button>
                                            <el-button plain class="rbtn colectBtn" @click="closeGame">關閉</el-button>
                                        </div> 
    
                                    </div>
                                    <div class="gameSwitchs">
                                        <el-scrollbar class="el-scrollbar-wrap">
                                            <!-- 遊戲按鈕 -->
                                            <ul class="gameLists">
                                                <li class="gl-item" v-for="(item,index) in gameOnOffs">
                                                    <input type="text" v-model="item.t" class="gameInput" placeholder="請輸入遊戲鏈接" />
                                                    <span class="ctatus" :class="{ cTactive: item.g}" @click="toggleOnoff(index)"></span>      
                                                </li>
                                               <!--  <li class="gl-item">
                                                   <input type="text" v-model="gameOnoff.t2" class="gameInput" placeholder="請輸入遊戲鏈接" />
                                                   <span class="ctatus"></span>     
                                               </li>
                                               <li class="gl-item">
                                                   <input type="text" v-model="gameOnoff.t3" class="gameInput" placeholder="請輸入遊戲鏈接" />
                                                   <span class="ctatus"></span>          
                                               </li> -->
                                            </ul>
                                        </el-scrollbar>
                                    </div>
                                </div>
                                <!-- 遊戲開關按鈕 -->
                                <div class="gameOnoffBtn gameOnoffBtnPad">
                                    <el-button plain class="rbtn uploadFile" @click="openGame">打開</el-button>
                                    <el-button plain class="rbtn colectBtn" @click="closeGame">關閉</el-button>
                                </div> 
                               <div class="gamebox-theme">
                                    <h3 class="column-title column-title-2 column-title-themeSelect" >主題選擇</h3>      
                                    <!-- 主題選擇 -->
                                    <div class="theme-select-wrap">
                                        <div class="theme-show-box">
                                            <h4>主題選擇</h4>
                                            <span v-model="selectValue" class="selctValue">春天</span>
                                        </div>
                                        <div class="theme-select-box">
                                            <span class="select-box"></span>
                                        </div>
                                    </div>
                               </div>
                            </div><!--// end gamebox-->
                        </div><!--// end previewBox-->
                    </div><!--// end previewBoxWrap-->
                </div><!--// end pc-previewWrap-->
            
       </div> 
    </div>

</div>
</template>







<script scoped >
    import Histogram from '@/base/histogram/histogram'
    import On from '@/base/on/on'
    import tool from 'common/js/tool'
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import wt from './wt.js'

    export default{
        data(){
            return {
                gameOnOffs: [
                    {
                        t : '',
                        g : false
                    },
                    {
                        t : '',
                        g : false
                    },
                    {
                        t : '',
                        g : false
                    }
                ],
                new_program_url: this.$baseUrl+'/api/createShow',
                entry_program_url: this.$baseUrl+'/api/pushShow',
                game_info_url: this.$baseUrl+'/api/getGameUpdateInfo',
                get_user: this.$baseUrl+'/api/user',
                showLines: true,
                gamearea: '',
                game_url: this.$baseUrl+'/api/gameUpdate',
                get_all_file: this.$baseUrl+"/api/getAllFileInfo",
                get_current_program: this.$baseUrl+'/api/getLastShow',
                selectValue: '春天',
                programName: '',
                gameClickOnOff: false,
                initGetProgram: true
            }
        },
        methods:{
            //初始化当前的节目
            initCurrentProgram(){
               if(/*!tool.sget('initOnoff')*/true){
                     //3. 節目請求
                    this.$axios.post(this.get_current_program).then((res)=>{
                       console.log(JSON.parse(res.data.data));
                       if(res.data.status == 'success'){

                            //获取数据
                            
                            //根据已有资源重组
                            var cd = wt.formatData(JSON.parse(res.data.data));
                            //console.log(cd)
                            
                            //设置本地存储
                            tool.setCurrentProgram(cd);

                            //this.$router.go(0);
                            //location.reload();
                       }
                    })

                    tool.sset('initOnoff',true);
               }  

            },
            //切換遊戲鏈接
            toggleOnoff(index){

                //清空所有
                for(var i=0;i<this.gameOnOffs.length;i++){
                    this.gameOnOffs[i].g = false;
                }

                this.gameOnOffs[index].g = true;
            },
            //打開遊戲
            openGame(){
                var v = '';
                for(var i=0;i<this.gameOnOffs.length;i++){
                    if(this.gameOnOffs[i].g){
                        v = this.gameOnOffs[i].t;
                        break;
                    }else{
                        if(i == this.gameOnOffs.length-1){
                            this.$message({
                              showClose: true,
                              message: '請選擇遊戲！',
                              type: 'error'
                            });
                            return;
                        }
                    }
                }

                this.requestGame(v,true);
            },
            //關閉遊戲
            closeGame(){
                var v = '';
                for(var i=0;i<this.gameOnOffs.length;i++){
                    if(this.gameOnOffs[i].g){
                        v = this.gameOnOffs[i].t;
                        break;
                    }else{
                        if(i == this.gameOnOffs.length-1){
                            this.$message({
                              showClose: true,
                              message: '請選擇遊戲！',
                              type: 'error'
                            });
                            return;
                        }
                    }
                }

                this.requestGame(v,false);
            },
            addFileBtn(){
                this.$router.push({'path':'/select'})
            },
            tabClick(){

            },
            //點擊收藏
            goup(){

                //1. 檢測是否滿足收藏的條件
                if(!this.checkIsRequest()){
                    return;
                }

                //彈出填入節目名字的輸入框
                this.$prompt('請輸入節目名稱', 'DBS溫馨提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消'
                  }).then(({ value }) => {

                        var config = {
                            showName: value,
                            deviceName: 'dbs01',
                            isPush: 0
                        };

                        var url =  this.new_program_url;     
                        this.requestProgram(url,config,()=>{
                            var timer = setTimeout(()=>{
                                this.reset();
                                clearTimeout(timer);
                            },1000);
                        });

                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '取消輸入'
                    });       
                });

                return; 
            },
            checkIsRequest(){



                //1-1.是否有時間重複的地方 檢測是否有紅色塊
                if(tool.checkTimeRepeat()){
                    this.$message({
                      showClose: true,
                      message: '節目編排時間段有衝突(紅色部分)，請仔細核對！',
                      type: 'error'
                    });
                    return false;
                }
                
                //console.log(tool.checkTimeRepeat())
                //1-2.是否添加時間線後沒有添加素材
                //通過時間線來檢測是否添加素材
                var info = tool.checkFolderByTimeLine();  
                if(info){
                    this.$message({
                      showClose: true,
                      message: info.message,
                      type: 'error'
                    });
                    return false;
                }

                //1-3.是否添加素材後沒有添加時間線
                //通過素材來管理是否有添加時間
                var info2 = tool.checkTimeByFolder();   
                if(info2){
                    this.$message({
                      showClose: true,
                      message: info2.message,
                      type: 'error'
                    });
                    return false;
                }

                return true;
            },
            //點擊上線節目
            entry(){ 

                 //1. 檢測是否滿足上線的條件
                if(!this.checkIsRequest()){
                    return;
                }
                
                //彈出填入節目名字的輸入框
                this.$prompt('請輸入節目名稱', 'DBS溫馨提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消'
                  }).then(({ value }) => {

                    //上線的配置參數
                    var config = {
                        showName: value,
                        deviceName: 'dbs01',
                        isPush: 1
                    };

                   
                    
                    //2. 上線
                    var url =  this.new_program_url;
                    this.requestProgram(url,config,()=>{
                        //3. 上線後清除當前重置所有本地數據
                        var timer = setTimeout(()=>{
                            this.reset();
                            tool.sset('initOnoff','');
                            clearTimeout(timer);
                        },1000)
                    });
                    

                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '取消輸入'
                    });       
                });
                
            },
            //點擊重置節目
            reset(){
               
                //1. 隱藏圖表數據
                localStorage.setItem('showLines',false);
                this.showLines = false;

                //2. 清除當前所有時間list和文件list
                tool.lset('file_list_on',[]);
                tool.lset('time_list_on',[]);
                tool.lset('file_list_off',[]);
                tool.lset('time_list_off',[]);
                tool.lset('file_list_full',[]);
                tool.lset('time_list_full',[]);

                //3. 刷新頁面 重新渲染數據
                location.reload(); 
            },
            requestProgram(url,config,fn){
                
                //1.獲取當前的用戶名
                var username = '';
                var jsons = {};
                var baseConfig = {};
                
                this.$axios.post(this.get_user).then((res)=>{
                    username = res.data.data.name;

                    //2. 組裝數據列表
                    jsons = tool.packageData(username);

                    //檢測是否存在數據
                    if(!tool.checkExistData(jsons.program)){
                        this.$message({
                          showClose: true,
                          message: '請編輯節目後再上線！',
                          type: 'error'
                        });

                        return;
                    }

                    //檢測是否超過最大字符串
                    if(JSON.stringify(jsons).length >= 4000){
                        this.$message({
                          showClose: true,
                          message: '當前節目內容太多，請合理刪減！',
                          type: 'error'
                        });
                        return;
                    }


                    //組裝請求數據
                    baseConfig = {
                        directorie: JSON.stringify(jsons)
                    };


                    if(config){
                       Object.assign(baseConfig,config); 
                    }


                    //3. 節目請求
                    this.$axios.post(url,baseConfig).then((res)=>{
                        
                        if(!config){
                            this.showLines = true
                        }

                        this.$message({
                          showClose: true,
                          message: res.data.message,
                          type: 'success'
                        });

                        fn&&fn();
                    })
                    
                })  
            },
            //請求開始遊戲,onoff
            requestGame(v,onoff){

              var value = v;
              var sw = onoff ? 1 : 0;
              var messages = onoff ? '遊戲開啓推送成功！':'遊戲關閉推送成功！';

              if(tool.strim(value,'g').length == 0){
                this.$message({
                  showClose: true,
                  message: '請輸入遊戲鏈接！',
                  type: 'error'
                });
                return;
              }

                //先獲取用戶的信息 檢測權限後再推送遊戲
                //獲取用戶信息，驗證是否有權限提交利率
                this.$axios.post(this.get_user).then((res)=>{
                    //success
                    if(res.data.status == 'success'){
                        //檢測用戶權限
                        if(res.data.data.role == 2 || res.data.data.role == 3){
                            //4. 向服務器發送數據
                             this.$axios.post(this.game_url,{
                                url: value,
                                switch: sw
                            }).then((res)=>{
                                this.$message({
                                  showClose: true,
                                  message: messages,
                                  type: 'success'
                                });
                            })
                        }else{
                          //checkUser = true;
                          this.$message.error('沒有權限進行此操作，請聯系管理員授權！');
                        }
                    }else{
                        this.$message.error('獲取用戶信息失敗!');
                    }
                }); 

            },
            //初始化獲取遊戲信息 更新遊戲狀態
            initGetGameInfo(){

                //4. 向服務器發送數據
                 this.$axios.post(this.game_info_url).then((res)=>{
                    if(res.data.status == 'success'){
                        var data = JSON.parse(res.data.data);
                        
                        //console.log(data);
                        if(data.url){
                            this.gameOnOffs[0].t = data.url;
                        }
                        if(data.switch){
                            this.gameOnOffs[0].g = data.switch == 1 ? true : false ;
                        }

                        //this.gameClickOnOff = false;
                    }
                })

            },
            ...mapMutations({
                setPublish:'publish'
            })
        },
        watch:{
            //監聽遊戲按鈕輸出變化
            gameOnoff: function(nv,ov){
                if(this.gameClickOnOff){
                    this.requestGame(nv);
                }
                this.gameClickOnOff = true;
            }
        },
        created(){
            this.initGetGameInfo();
            //初始化当前的节目
            this.initCurrentProgram();
        },
        components:{
            Histogram,
            On
        },
        mounted(){
            
        }
    }
</script>



<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"    
    
    

    
    .btnStyle{
        bgColor(#F4F4F4);color:#333;font-size:18px;initp();border-radius:10px;
     }
    
    .column-title-themeSelect
        display:none;

    .column-title-gameControl
        display:none;

    .mobile-previewWrap
        display:none;
        
    .previewWrap
        clear:both;

    .pc-header
        border-bottom:2px solid #DEDEDE;

    .control-menu
        wh(610px,108px);margin:0 auto;
        .item
            list-stype:none;float:left;width:171px;hh(110px);color:#333;font-size:18px;text-align:center;cursor:pointer;
        .menuActive
            .worktime
                bgColor(#5E8CEE);color:#fff;
            .notworktime
                bgColor(#5ED07F);color:#fff;
            .fullscreen
                bgColor(#F58E1F);color:#fff; 

    .content
        width:100%;height:auto;background:#fff;box-sizing:border-box;padding:0 30px;
                   
    .column-title
        font-size:20px;width:100%;color:#666;hh(70px);text-indent:28px;
        &:before
            content:'';@extend .block;wh(9px,24px);bgColor(#5E8CEE);position:absolute;left:0px;top:23px;
    .column-title-2
         position:relative;
         &:before
            bgColor(#ED1C24);        
    
    .previewBoxWrap
        border-right:1px solid #DEDEDE !important;
        
        
    .previewBox
        wh(100%,280px);border:1px solid #DEDEDE;
        .pbox
            float:left;box-sizing:border-box;
        .tubiaobox
            wh(76%,280px);border-right:1px solid #DEDEDE;position:relative;
    
            .introLists
                wh(190px,auto);list-style:none;ab(115px,70px);
                .introItem
                    wh(100%,36px);font-size:16px;color:#333;text-align:left;text-indent:30px;position:relative;
                    &:before
                        content:'';display:block;wh(18px,18px);border-radius:50%;ab(0,0);
                .introItem1
                    &:before        
                        bgColor(#5E8CEE);
                .introItem2
                    &:before        
                        bgColor(#5ED07F);
                .introItem3
                    &:before        
                        bgColor(#F58E1F);
                .introItem4
                    &:before        
                        bgColor(#DEDEDE);
        .chartViewBox
            ab(302px,70px);
        
        .collectionBtn
            ab(890px,120px);
        .resetBtn
            position:absolute;top:-55px;left:10px;        
        .rbtn
            width:128px;hh(40px);@extend .block;font-size:18px;color:#333;padding:0;border-radius:10px;
        .uploadFile
            bgColor(#ED1C24);color:#fff;margin-top:15px;position:relative;left:0px;
         
        .gamebox
            width:24%;height:280px;position:relative;
            .theme-select-wrap
                wh(100%,70px);position:absolute;bottom:0;left:0;border-top:1px solid #DEDEDE;
                .theme-show-box
                    wh(80%,70px);border-right:1px solid #DEDEDE;box-sizing:border-box;line-height:70px;font-size:18px;text-indent:20px;color:#333;font-weight:bold;position:relative;float:left;
                    .selctValue
                        position:absolute;right:0;top:0;box-sizing:border-box;padding-right:18px;color:#999;
                .theme-select-box
                    wh(19%,70px);position:relative;float:left;
                .select-box
                    display:block;wh(30px,16px);bgImg('~common/images/source/select@2x.png');ab(23px,29px);cursor:pointer;    
        .gameOnoffBtnPad
            display:none;
        .gameOnoffBtn
            display:flex;justify-content:flex-end;height:60px;line-height:60px;position:absolute;right:10px;top:15px;
            .rbtn
                wh(60px,40px);
            .uploadFile
                margin-top:0;border:0;    

        .gamebox-header
            wh(100%,69px);line-height:69px;font-size:18px;color:#333;text-indent:20px;border-bottom:1px solid #DEDEDE;position:relative;
            .switchbox
                width:51px;position:absolute;right:10px;top:18px;
                .el-switch__core
                    wh(51px,29px);width:51px !important;border-radius:25px;
                    .el-switch__button
                        wh(25px,25px);
        .gameSwitchs
            width:100%;height:140px;overflow-y:auto;overflow-x:hidden;
            .gameLists
                padding-bottom:20px;
                .gl-item
                    width:100%;height:60px;line-height:60px;box-sizing:border-box;padding:0 20px;
                    .gameInput
                        width:70%;height:40px;font-size:16px;color:#999;border-radius:6px;border:1px solid #DEDEDE;text-indent:20px;display:inline-block;bgColor(#F4F4F4);
                        &:focus
                           outline:none;border-color:#409EFF !important;
                    .switchbox
                        display:inline-block;margin-left:20px;
                    .ctatus
                        display:inline-block;wh(26px,26px);position:relative;top:10px;left:20px;bgImg('~common/images/yuan.png');cursor:pointer;
                    .cTactive
                        bgImg('~common/images/yuan_sel.png');    
                            
                    
        .inputGameBox
            display:block;wh(304px,86px);padding:3px 5px;bgColor(#F4F4F4);border-radius:10px;font-size:12px;line-height:14px;color:#999;margin:0 auto;margin-top:10px;                                               
</style>


<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin" 
    
    @media screen and (max-width: 1800px)
        .content .previewBoxWrap
            overflow-x: auto;border: 1px solid #dedede;
        .content .previewBox
            width:1482px;border:0; 
     
    @media screen and (max-width:1440px )
    
        .content .previewBoxWrap
            overflow: hidden;

        .column-title-gameControl
            display:block;
        .pc-previewWrap
            display:block;
            .previewBoxWrap
                width:100%;height:900px;border:none !important;
                .previewBox
                    width:100%;height:auto;
                    .tubiaobox
                        width:100%;height:auto;border:0;
                    .chartViewBox
                        position:static;clear:both;
                    .introLists
                        position:static;width:100%;clear:both;margin-top:40px;
                        .introItem 
                            float:left;width:auto;margin-left:10px;
                    .collectionBtn
                         position:static;width:100%;hh(80px);clear:both;
                         .rbtn
                             margin:0;margin-left:20px;margin-top:20px;
                             &:nth-of-type(1)
                                 margin-left:0;
                         .resetBtn,.colectBtn,.uploadFile
                             display:block;float:left;position:static;border-radius:4px;
                    .gamebox
                        width:100%;
                        .gamebox-header
                            display:none;         
                        .gameSwitchs
                            width:100%;height:200px;overflow-y:auto;overflow-x:hidden;
                            .gameLists
                                .gl-item
                                    width:100%;height:60px;line-height:60px;box-sizing:border-box;padding:0 20px;
                                    .gameInput
                                        width:70%;height:40px;font-size:16px;color:#999;border-radius:10px;border:1px solid #DEDEDE;text-indent:20px;display:inline-block;bgColor(#F4F4F4);
                                    .switchbox
                                        display:inline-block;margin-left:20px;
                        .gamebox-theme
                           width:30%;height:140px;position:relative;
                           .theme-select-wrap
                               border: 1px solid #dedede;
                               .select-box
                                 left:26%; 
                           .theme-show-box
                                h4
                                    display:none;
                                .selctValue
                                    width:100%;text-align:center;    
                                
                           .column-title-themeSelect
                               display:block;
                    .gameOnoffBtn
                        display:none;            
                    .gameOnoffBtnPad
                        display:flex;width:100%;position:relative;box-sizing:border-box;justify-content:flex-end;flex-direction:row-reverse;
                        .rbtn
                            margin-left:30px;
                        
                                  

    @media screen and (max-width: 1025px)  
              
        .pc-header
            .control-menu
                width:60%;height:80px;
                .item
                    width:33%;hh(80px);font-size:17px;overflow:hidden;
         .pc-previewWrap 
            .previewBoxWrap 
                .previewBox 
                   .gamebox 
                        .gamebox-theme   
                            width:30%;
                            .theme-select-wrap
                                .select-box 
                                    left:50%;margin-left:-13px;            
    @media screen and (max-width: 500px)       
        .pc-header
            .control-menu
                width:60%;height:50px;
                .item
                    width:33%;hh(50px);font-size:13px;overflow:hidden;               
        .pc-previewWrap 
            .previewBoxWrap 
                .previewBox 
                    .chartViewBox
                        transform:scale(.6);position:relative;left:-60px;top:-20px;
                    .collectionBtn
                        width:100%;
                        .rbtn 
                            width:80px;height:40px;font-size:13px;
                    .gamebox 
                        .gamebox-theme   
                            width:70%;     
</style>        


<style type="text/css">
    .el-scrollbar-wrap{
        height:100%;
    }
        
    .el-scrollbar-wrap .el-scrollbar__wrap{
        overflow-y:scroll;overflow-x:hidden;
    }     
</style>
