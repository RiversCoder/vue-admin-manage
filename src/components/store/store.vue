<template>

  <div ref="menuScroll" style="width:100%;">
     <el-scrollbar class="el-scrollbar-wrap">  

     <div class="con-container" ref="menuScroll" >
      <div style="padding-bottom:80px;">
          <div class="Column">
              <h3 class="column-title">账号存储空间</h3>
              
              <div class="chartPieBox">
                  <div class="chartBoxContent">
                      <h3>Sky Team</h3>
                      <h4>深圳市龙岗区坂田大道星河WORLD</h4>
                      <p >
                        <!-- <span class="stime">起始时间：2018.03.25</span>
                        <span class="etime">结束时间：2018.03.25</span> -->
                      </p>
                  </div>
                  <div class="cbp_wrap">
                    <div id="chartBoxPie" class="chartBoxPie"></div>
                  </div>
              </div>

              <h3 class="column-title">账号管理</h3>
              
              <div class="user-manage">

                <div class="inputBoxs">
                  <div class="ib-item">
                    <span class="btn-intro">创建子账户</span>
                    <el-input class="input-intro" v-model="input" placeholder="E-mail" type="email"></el-input>
                    <span class="btn-intro dbs-intro">@email.com</span>
                    <span class="dbs_psw_box">
                      <span class="btn-intro pwd-intro" >设置密码</span>
                      <el-tooltip class="item" effect="dark" content="提示：密码不能少于6位" placement="top">
                       <el-input class="input-intro" v-model="passwords" placeholder="Password" type="password" @focus="isfocus=true" @blur="isfocus=false"></el-input>
                       </el-tooltip>
                       <span v-show="false" class="pwdInfo">密码长度不得低于6位</span>
                    </span>
                  </div>
                  <div class="ib-item">
                   
                  </div>
               </div>

               <!-- <div class="inputBoxs">
                 <div class="ib-item ib-item-setting">
                    <span class="btn-intro">设置权限</span>
                     <div class="radioSelects">
                          <el-radio v-model="radio" label="3">发布游戏</el-radio>
                          <el-radio v-model="radio" label="4">发布利率</el-radio>
                     </div>
                  </div>
                  <div class="ib-item ib-item-create">
                    <el-button type="danger" @click="clickAddUser" class="addcBtns">确认创建</el-button>
                  </div>
               </div> -->


                <el-table :data="tableData" style="width: 100%;margin-top:25px;" max-height="300">
                  <el-table-column prop="id" min-width="80" label="账户ID"></el-table-column>
                  <el-table-column prop="name" min-width="120" label="用户名"></el-table-column>
                  <!-- <el-table-column prop="role" min-width="120" label="权限"></el-table-column> -->
                  <el-table-column prop="updated_at" min-width="120" label="时间"></el-table-column>
                  <!-- <el-table-column prop="address" min-width="120" label="操作">
                        <template slot-scope="scope" >
                            <el-button size="medium" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                  </el-table-column> -->
                </el-table>
              </div>  
          </div>
        </div>
     
      </div>
       </el-scrollbar>
</div>       
</template>



<script scoped>
    
    // 引入基本模板
    let echarts = require('echarts/lib/echarts')
    // 引入柱状图组件
    require('echarts/lib/chart/pie')
    // 引入提示框和title组件
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title')
    //import BScroll from 'better-scroll';
    import tool from 'common/js/tool.js'


    export default{
        data(){
            return{
                title: '',
                input: '',
                passwords: '',
                tableData: [],
                url: this.$baseUrl+'/api/addSubAccount',
                get_url: this.$baseUrl+'/api/subAccount',
                delete_url: this.$baseUrl+'/api/delSubAccount',
                attr:{},
                radio:'3',
                isfocus: false,
                get_pic_url: this.$baseUrl+'/api/imageTotal',
                get_video_url: this.$baseUrl+'/api/videoTotal',
                imageSize: 0,
                videoSize: 0,
                freeSize: 0,
                get_pv_url: this.$baseUrl+'/api/resourceTotal'
            }
        },
        props: {
        },
        methods:{
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
          },
          //初始化获取存储账户的子账户
          init(){

            //验证数据
            this.$axios.post(this.get_url).then((res)=>{
              
              if(res.data.status == 'success'){
                 this.tableData = res.data.data;
                 for(var i=0;i<res.data.data.length;i++){
                   this.tableData[i]['role'] = res.data.data[i].role == 3 ? '发布游戏' : '发布利率';
                 }
                 
              }

            }).catch((error)=>{
              //console.log(error)
            })

            //初始化获取图片存储的大小
            this.$axios.post(this.get_pv_url).then((res)=>{
              
              if(res.data.status == 'success'){
                 this.imageSize = this.formatStorage(res.data.data.imageTotal*30);
                 this.videoSize = this.formatStorage(res.data.data.videoTotal*30);
                 this.freeSize = this.formatStorage((30-this.imageSize-this.videoSize));
                 this.drawPie();
              }

            }).catch((error)=>{
              //console.log(error)
            })


          },
          formatStorage(snum){
            var s = snum.toString();
            var xiaoshu = s.split('.')[1];
            var result = s;

            if(xiaoshu){
              result = s.split('.')[0]+'.'+xiaoshu.substr(0,3);
            }

            return result
          },
          //点及添加子账户
          clickAddUser(){
            if(!this.input || !this.passwords){
              this.$message.error('邮箱或密码不能爲空!');

            }else{

              if(!/^\w+$/.test(this.input)){
                this.$message.error('邮箱或格式错误!');
                return;
              }

              this.attr['name'] = tool.strim(this.input+'@dbs.com','g');
              this.attr['password'] = tool.strim(this.passwords,'g');
              this.attr['role'] = this.radio;


              this.$axios.post(this.url,this.attr).then((res)=>{
                
                if(res.data.status == 'success'){
                  this.init();
                  this.$message({
                    message: '恭喜你，成功添加子账户！',
                    type: 'success'
                  });
                }

                if(res.data.status == 'error'){
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'error'
                  });
                }
              
              }).catch((error)=>{
                console.log(error)
              })

            }
          },
          selectFn(index){
            var items = document.querySelectorAll('.cc-item');
            items[index].classList.toggle('cactive');
          },
          drawPie(){
                // 基于淮备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('chartBoxPie'))
                // 绘制图表
                let option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:['空闲 (GB)','VIDEO (GB)','图片 (GB)']
                    },
                    series: [
                        {
                            name:'存储空间',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'left'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value:this.videoSize, name:'VIDEO (GB)',itemStyle: {color: '#5ED07F'}},
                                {value:this.imageSize, name:'图片 (GB)',itemStyle: {color: '#F6CF5F'}},
                                {value:this.freeSize, name:'空闲 (GB)',itemStyle: {color: '#CCCCCC'}}
                            ]
                        }
                    ]
                };
                myChart.setOption(option);
            },
            //点击删除子账户
            handleDelete(data){

                this.$confirm('此操作将删除该子账号, 是否继续?', 'DBS温馨提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  //handleDelete
                  this.$axios.post(this.delete_url,{'sub_id':data.id}).then((res)=>{
                      if(res.data.status == 'success'){
                        this.init();
                        this.$message({
                          message: '成功删除该子账户！',
                          type: 'success'
                        });
                      }else{
                        this.$message.error(res.data.message);
                      }
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });          
                });
            }
        },
        created(){
          this.init();
          //初始化better-scroll
          this.$nextTick(() => {
            //this._initScroll()
          });
        },
        mounted(){
            this.drawPie();
            this.initScrollHeight();
        }
    }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">

    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
    
    .el-scrollbar-wrap
        height:100%;
        .el-scrollbar__wrap
            overflow:auto;
            .is-vertical
              .el-scrollbar__thumb
                display:none;

    .pwdInfo
      color:#f0b551;font-size:13px;display:block;float:left;height:42px;line-height:42px;padding-left:20px;

    .con-container
            width:100%;box-sizing:border-box;background:#fff;padding:32px 46px 10px 32px;overflow-x:hidden;
            .inputBoxs
              width:100%;hh(42px);padding-top:26px;
              .ib-item
                padding-right:40px;float:left;
                .addcBtns 
                  transform:translateY(-5px);
                .radioSelects
                  hh(40px);float:left;margin-left:40px;transform:translateY(-5px);
                .btn-intro
                  padding-left:40px;
                  &:nth-of-type(1)
                    padding-left:0;
              
    .Column
        width:100%;height:auto;initp();
        
        .column-title
            font-size:20px;color:#666;hh(70px);text-indent:28px;position:relative;
            &:before
                content:'';@extend .block;wh(9px,24px);bgColor(#f0b551);position:absolute;left:0px;top:23px;
        
        .chartPieBox
            width:100%;min-height:430px;border-radius:6px;box-sizing:border-box;border:1px solid #dedede;margin-bottom:0px;
            .chartBoxContent
                wh(50%,430px);letter-spacing:2px;padding-left:138px;box-sizing:border-box;color:#333;float:left;
                h3
                    font-size:45px;hh(63px);padding-top:99px;
                h4
                    font-size:23px;hh(43px);
                p 
                   font-size:16px;hh(58px);letter-spacing:1px;
                   .etime
                       position:relative;left:116px;                   
            .chartBoxPie
                wh(50%,430px);float:left;
        .user-manage
            width:100%;min-height:351px;box-sizing:border-box;border-radius:6px;border:1px solid #dedede;padding-top:26px;padding-bottom: 32px;padding-left:50px;padding-right:50px;       
            .el-button--danger
                background-color: #f0b551;border-color: #f0b551;
                &:hover
                    opacity:0.8;
            .el-table td,.el-table th.is-leaf
                border:0 !important;
            .el-table
                &:before
                    display:none;  
            .btn-intro
                display:block;font-size:16px;color:#333;float:left;line-height:40px;
            .pwd-intro
                display:none;    
            .input-intro
                width:206px;float:left;margin-left:40px;
                input
                    background:#F4F4F4;color:#999;border-radius:10px; 
    
 
</style>









<style scoped lang="stylus" rel="stylesheet/stylus">

    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
    @media screen and (max-width:1500px)
      .Column 
        .chartPieBox
          height:auto;
          .chartBoxContent
            padding-left:80px;  
   
    @media screen and (max-width:1320px)
      .Column 
        .chartPieBox
          height:auto;
          .chartBoxContent
            padding-left:20px;  
            
    @media screen and (min-width: 1025px) and (max-width: 1180px) 
        .Column 
          .chartPieBox
            height:auto;
            .chartBoxContent
              padding-left:20px;
              h3
                font-size:36px;
              h4
                font-size:18px; 
            #chartBoxPie
              width:42%;    
            
        .user-manage
          .dbs_psw_box
            height:100px;
          .inputBoxs
            clear:both;height:150px;
            &:nth-of-type(2)
              padding-top:10px; 
            .ib-item
              .btn-intro
                display:block;float:none;margin-left:0;padding-left:0;
              .dbs-intro
                float:left;margin-left:30px;
              .pwd-intro
                visibility:hidden;
              .input-intro
                display:block;float:left;margin-left:0; 
              .radioSelects
                padding-left:0;margin-left:0;
            .ib-item-setting
              float:none; height:100px; 
            .ib-item-create
              float:none;height:50px;      
    
    @media screen and (max-width:905px)
      .user-manage
        .dbs_psw_box
          display:block;height:80px;line-height:40px;margin-top:50px;
          .pwd-intro
              display:inline-block;
          .input-intro
              display:inline-block;float:none;margin-left:56px; 
              
      .Column 
        .chartPieBox
          height:auto;
          .chartBoxContent
            padding-left:20px;
            h3
              font-size:36px;
            h4
              font-size:18px; 
          #chartBoxPie
            width:46%;
                     
    @media screen and (max-width:680px)
      .Column 
          .chartPieBox
            height:600px;
            .chartBoxContent
              padding-left:0px;width:100%;text-align:center;height:260px;
              h3
                font-size:36px;
              h4
                font-size:18px; 
            .cbp_wrap
              width:100%;height:300px;clear:both;
              #chartBoxPie
                width:300px;height:300px;margin:0 auto;position:relative;left:50%;transform:translateX(-50%);
      .user-manage
        .dbs_psw_box
          height:100px;
        .inputBoxs
          clear:both;height:150px;
          &:nth-of-type(2)
            padding-top:10px; 
          .ib-item
            .btn-intro
              display:block;float:none;margin-left:0;padding-left:0;
            .dbs-intro
              float:left;margin-left:30px;  
            .input-intro
              display:block;float:left;margin-left:0; 
            .radioSelects
              padding-left:0;margin-left:0;
          .ib-item-setting
            float:none; height:100px; 
          .ib-item-create
            float:none;height:50px;   
                          
     @media screen and (max-width:500px)
        .con-container
          padding-left:18px;padding-right:18px;
        .Column 
          .chartPieBox 
            .chartBoxContent
              h3
                font-size:35px;padding-left: 10px;padding-right: 10px;  
              h4
                font-size:18px;padding:0 10px;  
            .chartBoxPie
              width:300px;
        .user-manage
          .dbs_psw_box
             margin-top:10px;height:60px;
          .inputBoxs
            .ib-item
              .btn-intro
                display:block;float:none;margin-left:0;padding-left:0;
              .pwd-intro
                display:none;  
              .dbs-intro
                margin-left:0px;  
              .input-intro
                display:block;float:left;margin-left:0; 
              .radioSelects
                padding-left:0;margin-left:0;
            .ib-item-setting
              float:none; height:100px; 
            .ib-item-create
              float:none;height:50px;
     
     @media screen and (max-width:413px)
        .Column
          .user-manage
            padding-left:15px;padding-right:15px;
            .dbs_psw_box
               margin-top:10px;height:60px;
            .inputBoxs
              .ib-item
                .btn-intro
                  display:block;float:none;margin-left:0;padding-left:0;
                .pwd-intro
                  display:none;  
                .dbs-intro
                  margin-left:0px;  
                .input-intro
                  display:block;float:left;margin-left:0; 
                .radioSelects
                  padding-left:0;margin-left:0;
                  .el-radio
                    display:block;margin-left:0;margin-top:15px;
              .ib-item-setting
                float:none; height:100px; 
              .ib-item-create
                float:none;height:50px; margin-top:8px;     
</style>


<style scoped type="text/css">
    
      
   /*  @media screen and (max-width:1680px){
     .con-container{
       height:1080px;
     }
     .Column .chartPieBox{
       height:830px;
     }
     .Column .chartPieBox .chartBoxContent{
       width:100%;clear:both;padding-left:0;text-align: center;height:320px;
     }
     .Column .chartPieBox .chartBoxContent p .stime{
       position:relative;left:-20px;
     }
     .Column .chartPieBox .chartBoxContent p .etime{
       left:10px;
     }
     .Column .chartPieBox .chartBoxPie{
       width:677px;clear:both;position: relative;left:50%;transform: translateX(-50%);
     }
     .Column .cbp_wrap{
       width:100%;height:430px;
     }
   } */
</style>


<style type="text/css">
  .el-radio__input.is-checked+.el-radio__label{
      color: #f0b551 !important;
    }
    .el-radio__input.is-checked .el-radio__inner{
      border-color: #f0b551 !important;
      background: #f0b551 !important;
    }
</style>