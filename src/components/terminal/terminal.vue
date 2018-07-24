<template>

  <div ref="menuScroll" style="width:100%;">
     <el-scrollbar class="el-scrollbar-wrap">
   <div class="con-container">
      <div>
        <div class="Column">
            <h3 class="column-title">利率填寫</h3>
            
            <div class="lilv-content">

                <div class="forWrap">
                  <div class="formBox formBox1">
                      <el-row>
                         <el-col :span="24"><div class="grid-content">
                             <h3 class="fb-title">星展豐盛理財新客戶尊享</h3>
                         </div></el-col>
                      </el-row>
                      <el-row>
                         <el-col :span="24"><div class="grid-content">
                             <el-input class="input-lilv" v-model="ipt1.input1" placeholder="星展興盛理財新客戶尊享"></el-input>
                         </div></el-col>
                      </el-row>
                      
                      <el-row>
                         <el-col :span="9"><div class="grid-content">
                             <el-input class="input-lilv input-lilvTwo" v-model="ipt1.input2" placeholder="港元"></el-input>
                         </div></el-col>
                         <el-col :span="4"><div class="grid-content">&nbsp;</div></el-col>
                         <el-col :span="9"><div class="grid-content">
                             <el-input class="input-lilv input-lilvTwo" v-model="ipt1.input3" placeholder="總回報"></el-input>
                         </div></el-col> 
                      </el-row>
                      
                      <!-- <el-row>
                         <el-col :span="24"><div class="grid-content">
                             <el-input class="input-lilv" v-model="input1_4" placeholder="請輸入百分比"></el-input>
                         </div></el-col>
                      </el-row> -->
                      
                      <el-row>
                         <el-col :span="24"><div class="grid-content">
                             <el-button class="resetBtn" @click="resetClick1">重置</el-button>
                         </div></el-col>
                      </el-row>
                    
                      
                      <el-row>
                         <el-col :span="24"><div class="grid-content">
                             <el-button class="edgeSubmitBtn" @click="submitLeft">提交</el-button>
                         </div></el-col>
                      </el-row>
                    

                  </div><!--//end formBox1-->
              </div>

                <div class="forWrap">
                  <div class="formBox formBox2">
                      <el-row>
                         <el-col :span="24"><div class="grid-content">
                             <h3 class="fb-title">定期存款客戶尊享</h3>
                         </div></el-col>
                      </el-row>
                      <el-row>
                         <el-col :span="24"><div class="grid-content">
                             <el-input class="input-lilv" v-model="ipt2.input1" placeholder="定期存款客戶尊享"></el-input>
                         </div></el-col>
                      </el-row>
                      <el-row>
                         <el-col :span="9"><div class="grid-content">
                             <el-input class="input-lilv input-lilvTwo" v-model="ipt2.input2" placeholder="紐元"></el-input>
                         </div></el-col>
                         <el-col :span="4"><div class="grid-content">&nbsp;</div></el-col>
                         <el-col :span="9"><div class="grid-content">
                             <el-input class="input-lilv input-lilvTwo" v-model="ipt2.input3" placeholder="定期存款"></el-input>
                         </div></el-col>
                      </el-row>
                      
                      <el-row>
                         <el-col :span="24"><div class="grid-content">
                             <el-input class="input-lilv" v-model="ipt2.input4" placeholder="請輸入百分比"></el-input>
                         </div></el-col>
                      </el-row>

                      <el-row>
                         <el-col :span="24" ><div class="grid-content">
                             <el-button class="resetBtn" @click="resetClick2">重置</el-button>
                         </div></el-col>
                      </el-row>

                      
                      <el-row>
                         <el-col :span="24"><div class="grid-content">
                             <el-button class="edgeSubmitBtn" @click="submitRight">提交</el-button>
                         </div></el-col>
                      </el-row>
                  </div> <!--//end formBox2-->
                </div>                

            </div><!-- //end  lilv-content-->
        </div>


        <div class="Column">
            <h3 class="column-title">利率統計(月)</h3>
            
            <div class="input-content">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                  <el-form-item label="日期">
                    <el-date-picker
                      v-model="formInline.date"
                      type="date"
                      placeholder="選擇日期"
                      ref="selectDate"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="利率">
                    <el-tooltip class="item" effect="dark" content="提示：可以省略百分號" placement="top">
                      <el-input v-model="formInline.rate" placeholder="利率"></el-input>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" class="inertBtn" @click="insertData">新增利率</el-button>
                  </el-form-item>
                  <el-form-item class="r">
                    <input type="file" name="file" style="display:none;" ref="tableFile" @change="loadExcel" />
                    <el-button type="primary" class="uploadBtn" @click="uploadTable">上傳Excel表格</el-button>
                  </el-form-item>
                  <el-form-item class="r">
                    <a href="https://skylander-dbs.oss-cn-hongkong.aliyuncs.com/default/interestRate.xlsx"><el-button class="downBtn">下載模板</el-button></a>
                  </el-form-item>
                 
                </el-form> 
            </div>

            <div class="table-content">
                <template>
                  <el-table
                    :data="tableData"
                    max-height="350"
                    style="width: 100%"
                    :default-sort = "{prop: 'date', order: 'descending'}"
                    :resizable="true">
                    
                    <el-table-column
                      prop="date"
                      label="日期"
                      min-width="150"
                      sortable
                      align="left">
                    </el-table-column>
                    <el-table-column
                      prop="rate"
                      label="利率"
                      min-width="150"
                      sortable
                      align="left">
                    </el-table-column>
                    <el-table-column label="操作" min-width="200" align="left">
                          <template slot-scope="scope" >
<!-- <el-button size="medium" type="default" class="tableBtn" @click="handleEdit(scope.row)">編輯</el-button>
<el-button size="medium" type="primary" class="tableBtn" @click="handleDelete(scope.row)">刪除</el-button> -->
                              <span class="tableOperateBtn robEdit" @click="handleEdit(scope.row)">編輯</span>
                              <span class="tableOperateBtn robRemove" @click="handleDelete(scope.row)">刪除</span>
                          </template>
                    </el-table-column>
                  </el-table>
              </template>

            </div><!-- //end  table-content-->

            <div class="publishBtnBox">
                <el-button class="r pbBtn" type="primary" @click="publishRate">發布利率</el-button>
                <el-button class="r pbBtn clearBtn" type="default" @click="clearRateLists">清空列表</el-button>
            </div>

        </div>  

      </div>

      <el-dialog title="修改利率" :visible.sync="dialogFormVisible">
          <el-form :inline="true" :model="editformInline" class="demo-form-inline">
            <el-form-item label="日期">
              <el-date-picker
                v-model="editformInline.date"
                type="date"
                placeholder="選擇日期"
                ref="selectDate"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="利率">
              <el-tooltip class="item" effect="dark" content="提示：可以省略百分號" placement="top">
                <el-input v-model="editformInline.rate" placeholder="利率"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-form> 
        
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editCloseSure">確 定</el-button>
          </div>

        </el-dialog>
      
    </div>
    </el-scrollbar>
</div>    
</template>



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

    inputStyle(){
        height:40px;line-height:40px;color:#999;bgColor(#F4F4F4);border-radius:10px;border:0;
    }
    
    .r
      float:right;
    .publishBtnBox
      width:100%;hh(80px);margin-top:30px;
      .pbBtn
        margin-right:30px;
        &:nth-of-type(1)
          margin-right:0px;
        
    .tableOperateBtn
      display:inline-block;width:80px;cursor:pointer;text-align:left;position:relative; 
      &:nth-of-type(1)
        text-indent:30px;
        &:before
          bgImg('~common/images/source/edit@2x.png');background-size:80%;background-position:center; 
      &:nth-of-type(2)
        text-indent:30px;
        &:before
          bgImg('~common/images/source/remove.png');background-size:80%;background-position:center;  
      &:hover
        text-decoration:underline; 
      &:before
          content:'';display:block;wh(22px,22px);position:absolute;

    
    .con-container
            width:100%;box-sizing:border-box;background:#fff;padding:32px 46px 60px 32px;
    .Column
        width:100%;height:auto;initp();padding-bottom:20px;
        
        .column-title
            font-size:20px;color:#666;hh(70px);text-indent:28px;position:relative;
            &:before
                content:'';@extend .block;wh(9px,24px);bgColor(#ED1C24);position:absolute;left:0px;top:23px;
        &:nth-of-type(2)
          height:600px;
          
    .lilv-content
        width:100%;min-height:480px;border-radius:10px;border:1px solid #f0b551;position:relative;margin-bottom: 50px;
        .formBox
            width:320px;min-height:300px;float:left;
            .fb-title
                font-size:16px;color:#333;font-weight:bold;text-align:center;hh(108px);
            .input-lilv
                width:319px;margin-bottom:22px;
                input
                    inputStyle();
                    &:focus
                      border:1px solid #999;   
            .input-lilvTwo
                width:140px;
        .forWrap
          width:50%;height:100%;float:left;overflow:hidden;        
          .formBox1
              margin:0 auto;float:none;
              .downBtn
                width:100%;margin-top:25px;
          .formBox2
              margin:0 auto;float:none;         
            
        .edgeSubmitBtn
          width:100%;margin-top:25px;color:#fff;bgColor(#ed1c24);opacity:1;
          &:hover
            opacity:.8;    
        .resetBtn
            width:100%
        .submitBtnBox
          wh(100%,50px);clear:both;padding-top:50px; padding-bottom:50px;      
          .tiJiaoBtn
              wh(280px,50px);display:block;color:#fff;font-size:20px;bgColor(#ED1C24);margin:0 auto;
              &:hover
                  opacity:0.8; 
    
        .downBtn:hover,.resetBtn:hover,.resetBtn:focus
            color: rgba(237, 29, 35, 0.8);
            border-color: rgba(237, 29, 35, 0.2);
            background-color: rgba(237, 29, 35, 0.1);
        
        .publishBtnBox
           margin-top:50px;    
         
                                         
</style>

<style type="text/css">
  
   .el-button:hover{
    opacity: 0.8
   }
   .clearBtn:hover,.downBtn:hover,.resetBtn:hover,.resetBtn:focus{
    color: rgba(237, 29, 35, 0.8);
    border-color: rgba(237, 29, 35, 0.2);
    background-color: rgba(237, 29, 35, 0.1);       
   }
               
   .el-button--danger{
        background-color: #ed1c24;
        border-color: #ed1c24;
   }
   .el-table .ascending .sort-caret.ascending{
     border-bottom-color: #ed1c24;
   }
   .el-table .descending .sort-caret.descending {
     border-top-color: #ed1c24;
   } 
   .el-date-table td.today span{
      color:#ed1c24;
   }
   .el-date-table td.current:not(.disabled) span{
     background-color: #ed1c24;
   } 
   .el-date-table td.available:hover{
    color:#ed1c24;
   } 
</style>

<style scoped type="text/css">
      @media screen and (max-width:1025px){
        .con-container{
          /* overflow:scroll; */
        }
      }
      @media screen and (max-width:1020px){
        .el-date-editor.el-input{
          width:auto;
        }
        .lilv-content{
          min-height: 850px;
        }
        .lilv-content .forWrap{
              width: 100%;min-height: 330px;position: relative;float:none;
        }
       /*  .forWrap:nth-of-type(2){
             min-height: 410px;
       }
       .forWrap .formBox{
         margin:0 auto;position: absolute;left:50%;-webkit-transform: translateX(-50%);
         -moz-transform: translateX(-50%);-ms-transform: translateX(-50%);-o-transform: translateX(-50%);transform: translateX(-50%);
       } */
      } 

      @media screen and (max-width:420px){
          .con-container{
            padding-left: 18px;padding-right: 18px;
          }
      }
</style>


<script type="text/ecmascript-6">

    //import BScroll from 'better-scroll';
    import xlsx from 'xlsx';
    import tool from 'common/js/tool'

    //console.log(xlsx);

    export default{
        data(){
            return{
                title: '',
                url: this.$baseUrl+'/api/interestRate',
                user_url: this.$baseUrl+'/api/user',
                ipt1:{
                  input1: '',
                  input2: '',
                  input3: ''
                },
                ipt2:{
                  input1: '',
                  input2: '',
                  input3: '',
                  input4: ''
                },
                templateInfo: [],
                tableData: [],
                formInline: {
                  date: '',
                  rate: ''
                },
                editformInline: {
                  date: '',
                  rate: '',
                  ndate: '',
                  nrate: ''
                },
                month: ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'],
                dialogFormVisible:false,
                focusDate: '',
                setRateUrl: this.$baseUrl+'/api/setMonthInterestRate',
                getRateUrl: this.$baseUrl+'/api/getMonthInterestRate',
                getLeftUrl: this.$baseUrl+ '/api/getLeftTable',
                getRightUrl: this.$baseUrl+ '/api/getRightTable',
                setLeftUrl: this.$baseUrl+ '/api/setLeftTable',
                setRightUrl: this.$baseUrl+ '/api/setRightTable'
            }
        },
        props: {

        },
        methods:{
            submit(){
              
               //1. 獲取參數
               var attr = {
                'title_left': this.input1_1,
                'currency_left': this.input1_2,
                'item_left': this.input1_3,
                'data_left' : this.input1_4,
                'title_right': this.input2_1,
                'currency_right': this.input2_2,
                'item_right': this.input2_3,
                'data_right' : this.input2_4,
               };

               //2.驗證規則
               var re = /(^\s*)|(\s*$)/g;
               var item = '';

              for(var key in attr){
                 item = attr[key].replace(/(^\s*)|(\s*$)/g, "");
                 
                 if(item!==0 && !item){
                    this.$message.error('親，表單內容不能爲空，請仔細檢查！');
                    return;
                  }else{
                    attr[key] = item;
                  }
              }


              //獲取用戶信息，驗證是否有權限提交利率
              this.$axios.post(this.user_url).then((res)=>{
                    //success
                    if(res.data.status == 'success'){
                        //檢測用戶權限
                        if(res.data.data.role == 3 || res.data.data.role == 2){
                            //4. 向服務器發送數據
                           this.$axios.post(this.url,attr).then((res)=>{
                                //success
                                if(res.data.status == 'success'){
                                    this.$message({
                                      message: '恭喜你，利率信息提交成功！',
                                      type: 'success'
                                    });
                                }else{
                                    this.$message.error('提交數據失敗!');
                                }
                            }); 

                        }else{
                          this.$message.error('沒有權限進行此操作，請聯系管理員授權！');
                        }
                    }else{
                        this.$message.error('獲取用戶信息失敗!');
                    }
                });          
            },
            //初始化表格數據
            initRatesTabaleData(){
               //初始化
               this.$axios.post(this.getRateUrl,{
                  monthNumber: tool.getcMonthNumber()
                }).then((res)=>{
                    if(res.data.status == 'success'){
                       
                       this.tableData = tool.formatServerTableData(JSON.parse(res.data.data));

                    }else{
                        this.$message.error(res.data.message);
                    }
                });
            },
            //初始化獲取左側表右側表的數據
            initGetLeftRightData(){
              //初始化
               this.$axios.post(this.getLeftUrl).then((res)=>{
                    if(res.data.status == 'success'){
                       var datas = JSON.parse(res.data.data);
                       this.ipt1 = {
                         'input1': datas.title,
                         'input2': datas.currency,
                         'input3': datas.item
                       }
                    }
                });
               this.$axios.post(this.getRightUrl).then((res)=>{
                    if(res.data.status == 'success'){
                       var datas = JSON.parse(res.data.data);
                       this.ipt2 = {
                         'input1': datas.title,
                         'input2': datas.currency,
                         'input3': datas.item,
                         'input4': datas.data,
                       }
                    }
                });
            },
            //左側提交按鈕
            submitLeft(){
              
              var ipt = this.ipt1;
              
              //1. 檢測是否合理
              if(tool.submitIsRight(ipt).status){
                  this.$message({
                    showClose: true,
                    message: tool.submitIsRight(ipt).message,
                    type: 'error'
                  });
                  return;
              }

              //{"title":"星展銀行","currency":"港幣","item":"利率"}
              
              //2.組合數據
              var rateoop = {
                'title': ipt.input1,
                'currency': ipt.input2,
                'item': ipt.input3
              }

              this.$axios.post(this.setLeftUrl,{
                dataSet: JSON.stringify(rateoop)
              }).then((res)=>{
                  if(res.data.status == 'success'){
                     this.$message({
                          showClose: true,
                          message: res.data.message,
                          type: 'success'
                     });
                  }
              });
              
            },  
            //右側提交按鈕
            submitRight(){
              var ipt = this.ipt2;
              
              //1. 檢測是否合理
              if(tool.submitIsRight(ipt).status){
                  this.$message({
                    showClose: true,
                    message: tool.submitIsRight(ipt).message,
                    type: 'error'
                  });
                  return;
              }

              //{"title":"星展銀行","currency":"港幣","item":"利率"}
              
              //2.組合數據
              var rateoop = {
                'title': ipt.input1,
                'currency': ipt.input2,
                'item': ipt.input3,
                'data': ipt.input4
              }

              this.$axios.post(this.setRightUrl,{
                dataSet: JSON.stringify(rateoop)
              }).then((res)=>{
                  if(res.data.status == 'success'){
                     this.$message({
                          showClose: true,
                          message: res.data.message,
                          type: 'success'
                     });
                  }
              });
            },
            //上傳表格
            uploadTable(){
              //1. 打開選擇文件窗口
              this.$refs.tableFile.click();

              //2. 監聽表單事件
            },
            writeForms(){
              var datas = this.templateInfo;

              //格式化新的組合數據
              var newData = tool.tableFormat(datas);
              // console.log(newData);
              //格式化要顯示的數據
              var showData = tool.showtableFormat(newData);

              //存儲在sessionStorage裏面
              tool.sset('rate',showData);

              //把execl的數據填充在表格中
              this.tableData = showData;
            },
            //初始化加載
            initTableData(){
              //1.檢測session本地存儲是否有表格內容
              if(tool.sget('rate')){
                this.tableData = tool.sget('rate');
              }
            },
            //重置表單數據
            resetClick(num){
              for(var i=1;i<5;i++){
                this['input'+num+'_'+i] = '';
              }
            },
            //加載excel表格
            loadExcel(){
              var file = this.$refs.tableFile.files[0];
              var reader = new FileReader();
              var This = this;
              var rABS = false; //是否將文件讀取爲二進制字符串
              var wb = null; //讀取文件結果
              

              if(rABS) {
                  reader.readAsArrayBuffer(file);
              } else {
                  reader.readAsBinaryString(file);
              }

              reader.onload = function(e){
                var data = e.target.result;
                
                if(rABS)
                {
                    wb = xlsx.read(btoa(This.fixdata(data)), {type: 'base64'});
                } 
                else 
                {
                    wb = xlsx.read(data, {type: 'binary'});
                }

                //wb.SheetNames[0]是獲取Sheets中第一個Sheet的名字
                //wb.Sheets[Sheet名]獲取第一個Sheet的數據 [wb.SheetNames[0]]
                var arr = [];
                var ci = 0;
                var obj = {
                    date: '',
                    rate: ''
                 };

                for(var item in wb.Sheets){
                  arr.push(xlsx.utils.sheet_to_json(wb.Sheets[item]))
                }
                
                This.templateInfo = [];
                for(var i=0;i<arr[0].length;i++){
                    ci = 0;
                    obj = {
                      date: '',
                      rate: ''
                    }
                    for(var key in arr[0][i]){
                        if(ci == 0){
                          obj['date'] = arr[0][i][key];
                        }
                        if(ci == 2){
                          obj['rate'] = arr[0][i][key];
                        }
                        ci++;
                    }
                    This.templateInfo.push(obj);
                }

               //填入表單中                
               This.writeForms();
              }
            },
            fixdata(data) { //文件流轉BinaryString
                var o = "",
                    l = 0,
                    w = 10240;
                for(; l < data.byteLength / w; ++l)o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
                return o;
            },
            //新增利率數據至表格
            insertData(){

              //1. 獲取時間和利率數據
              //2. 檢測是否爲空
              if(!tool.strim(this.formInline.date,'g') ||  !tool.strim(this.formInline.rate,'g')){
                this.$message({
                  showClose: true,
                  message: '日期或利率不能爲空！',
                  type: 'error'
                });
                return;
              }

              //3. 去除空格
              var date = tool.strim(this.formInline.date,'g');
              var rate = tool.strim(this.formInline.rate,'g');
              
              //4. 檢測日期是否重複
              if(tool.checkTimeRepeats(date,this.tableData)){
                  this.$message({
                    showClose: true,
                    message: '該日期利率已存在, 請仔細核對後再次輸入！',
                    type: 'error'
                  });
                  return;
              }

              //5.檢測是否是當年，當月或者未來月份
              if(tool.checkDateIsCurrent(date)){
                this.$message({
                    showClose: true,
                    message: '日期不能小于當年當月, 請仔細核對後再次輸入!',
                    type: 'error'
                  });
                  return;
              }

              //5. 檢測利率格式是否正確
              rate = tool.checkRateFormat(rate);
              if(rate === true){
                this.$message({
                    showClose: true,
                    message: '利率格式輸入錯誤！',
                    type: 'error'
                });
                return;
              }

              
              //6.格式化當前的填入的數據
              var fdata = tool.formatPerTableData(date,rate); 

              //7.插入表格數據中
              this.tableData.push(fdata);

              //8.清空表單數據
              this.formInline.date = '';
              this.formInline.rate = '';

            },
            //刪除當前利率
            handleDelete(row){
               
               //重置tbale數據表
               var arr = this.tableData;

               for(var i=0;i<arr.length;i++){
                  if(arr[i].date == row.date){
                    arr.splice(i,1);
                    break;
                  }
               }
               
               this.tableData = arr;
            },
            handleEdit(row){
              //1. 顯示編輯彈窗
              this.dialogFormVisible = true;

              //2. 初始化默認框的值
              this.editformInline.date = row.date;
              this.editformInline.rate = row.rate;

              this.focusDate = row.date;

            },
            //確認編輯按鈕點擊
            editCloseSure(){

               //1. 隱藏彈出框
               this.dialogFormVisible = false;
               
               //2. 獲取到編輯框裏面的數據
               var date = this.editformInline.date;
               var rate = this.editformInline.rate;

               date = tool.strim(date,'g');
               rate = tool.strim(rate,'g');

              //5.檢測是否是當年，當月或者未來月份
              if(tool.checkDateIsCurrent(date)){
                 this.$message({
                    showClose: true,
                    message: '日期不能小于當年當月, 請仔細核對後再次輸入!',
                    type: 'error'
                  });
                 return;
              }

               //3. 驗證該數據是否合法
               rate = tool.checkRateFormat(rate);
               if(rate === true){
                  this.$message({
                      showClose: true,
                      message: '利率格式輸入錯誤！',
                      type: 'error'
                  });
                  return;
                }

                //4. 檢測日期是否重複 如果重複就覆蓋
                if(tool.checkTimeRepeats(date,this.tableData)){
                    //判斷是否是點擊的編輯那個日期
                    if(this.focusDate != date){
                      this.$message({
                          showClose: true,
                          message: '與表中其他日期重複，請仔細檢查！',
                          type: 'error'
                      });
                      return;
                    }
                }

              //4.格式化當前的填入的數據
              var fdata = tool.formatPerTableData(date,rate); 

              //5. 更換當條記錄
              var tdata = this.tableData;

              for(var i=0;i<tdata.length;i++){
                if(tdata[i].date == this.focusDate){
                  tdata.splice(i,1,fdata);
                  break;
                }
              }
            },
            //發布利率
            publishRate(){
              
              //1. 獲取當前表格數據
              var datas = this.tableData;

              //2. 判斷當前表格日期是否合法
              if(tool.checkExcelDates(datas).status){
                this.$message({
                    showClose: true,
                    message: tool.checkExcelDates(datas).message,
                    type: 'error'
                });
                return;
              }

               //3. 發送請求到服務器
               this.$axios.post(this.setRateUrl,{
                  monthDataSet: tool.formatJsonRate(datas).monthDataSet,
                  monthNumber: tool.formatJsonRate(datas).monthNumber,
                }).then((res)=>{
                    if(res.data.status == 'success'){
                       this.$message({
                          showClose: true,
                          message: res.data.message,
                          type: 'success'
                      }); 
                    }else{
                        this.$message.error(res.data.message);
                    }
                });

            },
            resetClick1(){
              this.ipt1 = { input1: '', input2: '', input3: ''};
            },
            resetClick2(){
              this.ipt2 = { input1: '',input2: '',input3: '',input4: ''};
            },
            //清空當前利率列表
            clearRateLists(){
              this.tableData = [];
              tool.sset('rate',[]);
            },
            initWrapHeight(){
                var ms = this.$refs.menuScroll;
                //var hf = this.$refs.headerFile;
                var hh = document.body.offsetHeight;
                var hf_height = 0;
                ms.style.overflow = 'hidden';
                

                function fn(){
                    hh = document.body.offsetHeight;
                    ms.style.height = hh - hf_height + 'px';
                    //console.log(document.body.clientHeight,hf_height)
                }

                fn();

                window.addEventListener('resize',fn);
            }
        },
        created(){
            //this.initTableData();
            this.initGetLeftRightData();
            this.initRatesTabaleData();
        },
        mounted(){
           this.initWrapHeight();
        }
    }
</script>












