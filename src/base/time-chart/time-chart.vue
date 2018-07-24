<template>
    <div>
        <div class="previewWrap">        
          <div class="pc-previewWrap">
              <h3 class="column-title column-title-2" >節目總預覽</h3> 
              <div class="previewBoxWrap" >
                  <div class="previewBox" >
                      <div class="pbox tubiaobox">
                          
                          <!-- 說明 -->
                          <ul class="introLists" v-show='false'>
                              <li class="introItem introItem1">工作</li>
                              <li class="introItem introItem2">非工作時間</li>
                              <li class="introItem introItem3">非工作時間</li>
                              <li class="introItem introItem4">無視頻展示</li>
                          </ul>
                          
                          <!-- 柱狀圖展示 -->
                          <div class="chartViewBox">
                              <Histogram></Histogram>
                          </div>
                          
                          <!-- 收藏、上線按鈕 -->
                          <div class="collectionBtn">
                              <el-button plain class="rbtn resetBtn" @click.native="resetData">重置</el-button>
                              <el-button plain class="rbtn colectBtn" @click.native="collectData">收藏</el-button>
                              <el-button plain class="rbtn uploadFile" @click.native="publishData">上線</el-button>
                          </div>    
                          
                      </div>
                    </div>
                  </div><!--// end previewBox-->
              </div><!--// end previewBoxWrap-->
          </div><!--// end pc-previewWrap-->      


          <!-- 弹框 -->
          <el-dialog
            title="请选择设备"
            :visible.sync="dialogVisible"
            width="80%"
            :before-close="handleClose">
            
            <!-- 设备列表 -->
            <div class="tableBox">
                <!-- 
                  <el-radio-group v-model="radio">
                    <el-radio :label="index" :key="index" v-for="item,index in deviceLists">{{item.name}}</el-radio>
                  </el-radio-group> 
                -->
                <el-checkbox-group v-model="deviceListsChecked">
                  <el-checkbox :label="index" :key="index" v-for="name,index in deviceIndexLists">{{name}}</el-checkbox>
                </el-checkbox-group>
            </div>

            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="makeSureGetDevice">确 定</el-button>
            </span>

          </el-dialog>


         <el-dialog title="温馨提示" :visible.sync="dialogFormVisible">
          <el-form>
            <el-form-item label="请输入节目名称">
              <el-input v-model="programName" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click.native="makeSureGetName">确 定</el-button>
          </div>
        </el-dialog>

    </div>
</template>

<script>
    
    import tool from 'common/js/tool';
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
    import svgs,{ templates } from '@/common/js/templates.js';
    import Histogram from '@/base/histogram/histogram';

    export default{
        data(){
            return {
              publishUrl: this.$baseUrl+'/api/createShow',
              deviceList: this.$baseUrl+'/api/deviceList',
              userInfoUrl: this.$baseUrl+'/api/user',
              deviceLists: [{name:'九鼎哈哈',id:34, created_at:'',is_online:1,pushId:''},{name:'設備名稱pa d',id:38, created_at:'',is_online:0,pushId:''},{name:'设备名称',id:36, created_at:'',is_online:0,pushId:''}],
              deviceIndexLists: [],
              deviceListsChecked: [],
              dialogVisible: false,
              dialogFormVisible: false,
              isPush: 0,
              pushId: [],
              userInfo: '',
              showName: '',
              directorie: '',
              programName: ''
            } 
        },
        methods:{
          //重置时间列表数据
          resetData(){
            this.setTimeList([]);
            this.setPublishData([]);
          },
          //获取节目发布列表
          getPublishList(){
            this.directorie = this.getPublishData;
          },
          //获取用户名信息
          getUserName(){
            this.$axios.post(this.userInfoUrl).then((res)=>{
              if(res.data.code == 200){
                this.userInfo = res.data.data.name;
                this.directorie.username = this.userInfo;
              }
            }); 
          },
          //获取设备列表
          getDeviceList(){
            this.$axios.post(this.deviceList).then((res)=>{
              if(res.data.code == 200){
                this.deviceLists = res.data.data;
                for(var i=0;i<this.deviceLists.length;i++){
                  this.deviceIndexLists.push(this.deviceLists[i]['name']);
                }
              }else{
                this.$message({
                  showClose: true,
                  message: '获取设备列表失败！',
                  type: 'error'
                });
              }
            }); 
          },
          //点击确定按钮 获取当前设备列表
          makeSureGetDevice(){
            var d = this.deviceListsChecked;
            for(var i=0;i<d.length;i++){
              this.pushId.push(this.deviceLists[d[i]]['pushId']);
            }
            this.upData();
            this.dialogVisible = false;
          },
          //点击输入节目名称确定按钮
          makeSureGetName(){
              
            //检测是否输入节目名称
            this.programName = tool.strim(this.programName,'g');
            if(!this.programName){
              this.$message({
                  showClose: true,
                  message: '请输入节目名称！',
                  type: 'error'
              });
              this.dialogFormVisible = false;
              return;
            }
            if(this.isPush == 0){
              //收藏节目
              this.upData();
              this.dialogFormVisible = false;
              return;
            };

            //隐藏 出现设备选择对话框
            this.dialogVisible = true;
            this.dialogFormVisible = false;

          },
          //收藏时间列表数据
          collectData(){
            this.isPush = 0;
            this.dialogFormVisible = true;
          },
          //上线节目按钮
          publishData(){
            this.isPush = 1;
            this.dialogFormVisible = true;
          },
          //发布上线
          upData(){

            var attr = {
              pushId: JSON.stringify(this.pushId),
              showName: this.programName,
              directorie: JSON.stringify(this.directorie),
              isPush: this.isPush+''
            };
            
            //发送请求
            this.$axios.post(this.publishUrl,attr).then((res)=>{
              
              if(res.data.code == 200){
                this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'success'
                });
              }
              
            });  

          },
          handleClose(){

          },
          ...mapMutations({
            'setPublishData': 'publishData',
            'setTimeList': 'timeList'
          })
        },
        computed:{
          ...mapGetters({
            'getTimeList': 'timeList',
            'getPublishData': 'publishData'
          })
        },
        watch:{
           
        },
        mounted(){
          
        },
        updated(){
          
        },
        created(){
          this.getPublishList();
          this.getUserName();
          this.getDeviceList();
        },
        components:{
          Histogram
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"    
    
     
    .column-title
        font-size:20px;width:100%;color:#666;hh(70px);text-indent:28px;
        &:before
            content:'';@extend .block;wh(9px,24px);bgColor(#5E8CEE);position:absolute;left:0px;top:23px;
    .column-title-2
         position:relative;
         &:before
            bgColor(#f0b551);  

     .previewBoxWrap
        border-right:1px solid #DEDEDE !important;
     
     .btnStyle{
        bgColor(#F4F4F4);color:#333;font-size:18px;initp();border-radius:10px;
     }   
        
    .previewBox
        wh(100%,320px);border:1px solid #DEDEDE;
        .pbox
            float:left;box-sizing:border-box;
        .tubiaobox
            wh(100%,100%);border-right:1px solid #DEDEDE;position:relative;
    
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
            ab(50%,50%);transform:translate3d(-50%,-70%,0);-webkit-transform:translate3d(-50%,-70%,0);-moz-transform:translate3d(-50%,-70%,0);
        
        .collectionBtn
            ab(50%,78%);transform:translate3d(-50%,0,0);wh(auto,42px)      
        .rbtn
            width:120px;hh(40px);@extend .block;font-size:18px;color:#333;padding:0;border-radius:10px;float:left;
        .uploadFile
            bgColor(#f0b551);color:#fff;
         
                        
</style>



