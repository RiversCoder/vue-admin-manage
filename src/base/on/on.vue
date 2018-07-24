<template>
    
    <div>
        
        <!-- 新增 Title 包裹 -->
        <div class="titileBox">
            <!-- <h4 class="column-title column-title-top">選擇素材</h4>    
            <h4 class="column-title column-title-top">時間控制</h4>  -->
        </div>
        
        <div class="timebox">
            <div class="tb_wrap">
                <h4 class="column-title column-title-top">選擇素材</h4>    
                <div class="tbox tbox1">
                    <div class="add-file-box">
                        <div class="add-source-wrap">
                            <ul class="imgWrap" ref="imgWrap">
                                <li v-for="(item,index) in cresults" :width="liw+'px'" :height="Math.floor((liw-1)*0.56)+'px'" >
                                    <img :src="item.img" alt="" :width="(liw)+'px'"  :height="Math.floor((liw-1)*0.56)+'px'" >
                                </li>
                            </ul>
                            <div class="add-source-btn" ref="addSourceBox" @click="addFileBtn">
                                <span class="addSucaiText">點擊添加輪播素材</span>
                            </div>
                        
                        </div>
                    </div>
                    <div class="infoTips">
                        <h4>建議視頻圖片尺寸比例：16：9</h4>
                        <h3>（有圖片才顯示）圖片默認展示時間爲10s</h3>
                    </div>  
                </div>
            </div>
            
            <div class="tb_wrap">
                <h4 class="column-title column-title-top">時間控制</h4> 
                <div class="tbox tbox2" ref="timeListBox">
                    <div class="tlistwrap" >
                        <ul class="tlists">
                            <li class="bitem bitem1" v-for="(item,index) in setTimes">
                                <span class="bitem-item bitem-time">{{item.time}}</span>
                                <span class="bitem-item bitem-day">
                                    {{item.date}}
                                </span>
                                <el-button @click="deleteTime(index)" class="deleteTimeItem" type="primary" icon="el-icon-delete"></el-button>
                            </li>
                        </ul>
                        <span class="add-bitem-btn" @click="dialogFormVisible = true;"></span>
                    </div>
                </div>
            </div>
        </div>
        
        <el-dialog title="選擇播放時段" :visible.sync="dialogFormVisible" class="selectTimeModel">
          <el-time-select v-model="value1" :picker-options="{ start: '00:00', step: '00:15', end: '24:00' }" placeholder="請選擇時間"></el-time-select>
          <el-time-select v-model="value2" :picker-options="{ start: '00:00', step: '00:15', end: '24:00' }" placeholder="請選擇時間"></el-time-select>
          <div class="checkboxs">
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="Sun"></el-checkbox>
                <el-checkbox label="Mon"></el-checkbox>
                <el-checkbox label="Tue"></el-checkbox>
                <el-checkbox label="wed"></el-checkbox>
                <el-checkbox label="Thu"></el-checkbox>
                <el-checkbox label="Fri"></el-checkbox>
                <el-checkbox label="Sat"></el-checkbox>
              </el-checkbox-group>
          </div>    

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="closeSure">確 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
    
    import tool from 'common/js/tool';
    import BScroll from 'better-scroll';
    import {mapGetters, mapMutations, mapActions} from 'vuex';


    export default{
        data(){
            return {
                value: true,
                value1: '',
                value2:'',
                checkList: [],
                dialogFormVisible: false,
                worktimes: [],
                cresults: [],
                liw:0,
                week: '000000',
                start: 0,
                duration: 0,
                setTimes: []
            }
        },
        methods:{
            //初始化綁定 better-scroll 
            _initScroll() {
              this.menuScroll = new BScroll(this.$refs.timeListBox, {
                click: true
              })
            },
            //初始化已經選擇的素材和時間
            init(){
                var box = this.$refs.imgWrap;
                var bheight = box.clientHeight;

                
                //this.liw = (Math.floor(box.clientHeight*2/this.cresults.length))/2;
                if(this.cresults.length <= 6){
                  this.liw = Math.floor(box.clientWidth/3);
                }else if(this.cresults.length > 6 && this.cresults.length <= 12){
                  this.liw = Math.floor(box.clientWidth/4.6);
                }else if(this.cresults.length > 12){
                  this.liw = Math.floor(box.clientWidth/6);
                }

            },
            //初始化已經選擇的文件
            initSelectFiles(){
                if(tool.lget('file_list_on')){
                    this.cresults = tool.lget('file_list_on');
                }
            },
            
            //初始化已經set的時間線
            initSetTimes(){
                //設置存儲空間
                if(!tool.lget('time_list_on')){
                    tool.lset('time_list_on',this.setTimes);
                }else{
                    //初始化數據
                    this.setTimes = tool.lget('time_list_on');
                }
                
            },
            addFileBtn(){
                this.$router.push({'path':'/program-production/select',query:{direct:'on'}});
            },
            //添加時間和星期
            closeSure(){

                this.dialogFormVisible = false;

                //驗證
                if(this.checkList.length==0 || !this.value1 || !this.value2){
                    this.$message.error('時間或星期不能爲空!');
                    return;
                }
                //驗證時間大小
                if(tool.changeTimetoSecond(this.value1) >= tool.changeTimetoSecond(this.value2)){
                    this.$message.error('親，時間先後順序設置錯誤！');
                    return;
                }

                //計算時間衝突
                if(tool.checkTime(this.setTimes,tool.countTimes(this.value1,this.value2,this.checkList))){
                    this.$message({
                      message: '時間設置衝突,請重新設置!',
                      type: 'warning'
                    });
                    return;
                }

                //計算並且存儲數據
                this.setTimes.push(tool.countTimes(this.value1,this.value2,this.checkList));
                tool.lset('time_list_on',this.setTimes);
                this.setPublish(Math.random());
                
            },
            //刪除時間項
            deleteTime(index){
                this.setTimes.splice(index,1);
                tool.lset('time_list_on',this.setTimes);
                this.$message({
                  message: '刪除成功!',
                  type: 'success'
                });
                this.setPublish(Math.random());
            },
           ...mapMutations({
            setPublish:'publish'
           })
        },
        compouted:{
            ...mapGetters(['results','model_type_1'])
        },
        watch:{
            cresults:{
               handler(newValue, oldValue) {
　　　　　　　　  for (let i = 0; i < newValue.length; i++) {
　　　　　　　　    if (oldValue[i] != newValue[i]) {
                      break;
　　　　　　　　    }
                }
        　　　　},
        　　　　deep: true
            }
        },
        mounted(){
            this.initSelectFiles();
            this.initSetTimes();
            this.init();
        },
        created(){
            this.$nextTick(() => {
              this._initScroll()
            });
        },
        components:{
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"    
    
    .btnStyle{
        bgColor(#F4F4F4);color:#333;font-size:18px;initp();border-radius:10px;
     }
     
    .infoTips
        width:100%;position:absolute;height:55px;top:316px;
        h4
            font-size:18px;width:100%;hh(28px);text-align:center;color:#999;
         h3
            font-size:17px;width:100%;hh(27px);text-align:center;color:#ED1C24; 

    .deleteTimeItem
        transition:.8;border-radius:0;bgColor(#5e8cee);border-color:#5e8cee;opacity:0.2;
        &:hover
            opacity:1; 
    .checkboxs
        width:100%;height:80px;padding-top:20px;
    .titileBox
        width:100%;display:flex;flex-direction:row;flex-wrap:wrap;     
    .column-title-top
        text-align:left;margin:0;-webkit-margin-before: 0em;-webkit-margin-after: 0em;-webkit-margin-start: 0px;-webkit-margin-end: 0px;position:absolute;               
    .column-title
        font-size:20px;width:50%;color:#666;hh(70px);text-indent:28px;position:relative;
        &:before
            content:'';@extend .block;wh(9px,24px);bgColor(#5E8CEE);position:absolute;left:0px;top:23px;
    .column-title-2
         &:before
            bgColor(#ED1C24);        
    .timebox
        wh(100%,470px);position:relative;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-between;
        .tb_wrap
            width:50%;height:398px;
            .tbox
                width:100%;box-sizing:border-box;position:relative;height:100%;
            .tbox1
                border:4px dashed #DEDEDE;overflow:hidden;
            .tbox2
                border:1px solid #DEDEDE;border-left:0;height:398px;overflow:hidden;
            .add-source-wrap
                wh(253px,152px);position:absolute;bottom:0;left:0;overflow:hidden; 
                .imgWrap
                    wh(100%,100%);list-style:none;
                    li
                        display:block;float:left;
                        img
                           display:block;       
        .add-source-btn
            wh(105px,111px);position:absolute;left:50%;margin-left:-48px;top:50%;margin-top:-55px;bgImg('~common/images/worktime/addBtn1_1.png');background-size:contain;cursor:pointer;
            .addSucaiText
              color:#587db7;width:100%;text-align:center;font-size:12px;letter-spacing:1px;position:absolute;bottom:3px;  
               
    .add-file-box
        wh(510px,200px);bgImg('~common/images/worktime/worktime.jpg');margin: 0 auto;position:relative;top:94px;
  
    .tlists
        wh(100%,auto);list-style:none;
        .bitem
            wh(100%,74px);border-bottom:1px solid #DEDEDE;display:flex;overflow:hidden;
            .bitem-item
                @extend .block;width:50%;hh(74px);font-size:18px;text-align:left;text-indent:23px;letter-spacing:2px;color:#333;box-sizing:border-box;
            .bitem-day
                text-align:right;padding-right:23px;font-size:16px;
                i 
                    font-style:normal;
    .add-bitem-btn
        @extend .block;wh(100%,65px);bgColor(#F4F4F4);bgImg('~common/images/worktime/add.png');background-size:30px 30px;background-position:center center;cursor:pointer;border-bottom:1px solid #DEDEDE;
                                                     
</style>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
    @media screen and (max-width: 1447px)
        .timebox
           .tb_wrap
               width:50%;
               &:nth-of-type(2)
                   .tbox 
                       border-left: none;
               .tbox 
                   width:100%;height:300px;position:relative;
                   .add-file-box
                       top:10px;wh(98%,180px); //510 200 
                       .add-source-wrap
                           wh(50%,76%); //253 152 
                    .infoTips
                        position:relative;top:25px;
   @media screen and (max-width: 1025px)
       
       .el-date-editor.el-input
            width:auto;   
       .timebox
           .tb_wrap
               width:50%;
               &:nth-of-type(2)
                   .tbox 
                       border-left: none;
               .tbox 
                   width:100%;height:300px;position:relative;
                   .add-file-box
                       top:10px;wh(98%,180px); //510 200 
                       .add-source-wrap
                           wh(50%,76%); //253 152
                    .infoTips
                        position:relative;top:25px; 

    @media screen and (max-width:900px)
       .timebox
           display:block;height:auto;
           .tb_wrap
               width:100%;
               .column-title
                   font-size:16px;
               &:nth-of-type(2)
                   .tbox 
                       border-left: 1px solid #dedede;
               .tbox 
                   width:100%;height:300px;position:relative;
                   .add-file-box
                       top:10px;wh(510px,200px); 
                    .infoTips
                        position:relative;top:25px;
    
    @media screen and (max-width:600px)
        .timebox
           .tb_wrap
               width:100%;
               &:nth-of-type(2)
                   .tbox 
                       border-left: 1px solid #dedede;
               .tbox 
                   width:100%;height:300px;position:relative;
                   .add-file-box
                       top:10px;wh(98%,180px); //510 200 
                       .add-source-wrap
                           wh(50%,76%); //253 152
                    .infoTips
                        position:relative;top:25px;
                        h4
                            font-size:13px;
                        h3
                            font-size:14px;             
</style>

<style type="text/css">
  @media screen and (max-width: 1025px){
    .el-dialog{
      width:70%;
    }
          
  }
</style>
