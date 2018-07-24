<template>
   <div class="con-container">
      <header class="header-file" style="min-height:108px">
            <div class="grid-content grid-content-1">
               <h3 class="drag-cc-title">素材拖拽排序</h3>
               <!-- <h3 class="drag-cc-title drag-cc-title-mobile">素材點擊排序</h3> -->
            </div>
            <div class="grid-content grid-content-2">
                <p style="display:none"><input name="file" type="file" value="選擇" size="20" id="fileUpload1" accept="image/png,image/gif,image/jpeg,video/mp4,application/ogg, audio/ogg,video/3gpp" @change ="changeUploadFile($event)" /></p>  
                <el-button plain class="rbtn uploadFile" @click.native="nextBtn">提交</el-button>
                <el-button plain class="rbtn newFolder" @click.native="lastBtn">上一步</el-button>
            </div>
      </header>

      <el-main>
          <el-scrollbar>
            <div class="cwrap" id="cwrap" ref="cwrap" style="height:1080px">
                <div>
                   <item-view :sources="selectData"></item-view>
                </div>
            </div>
          </el-scrollbar>  
      </el-main>

   </div>
</template>

<script scoped >
    
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
    import ItemView from '@/base/item-view/item-view';
    import datas from 'common/js/data';
    import tool from 'common/js/tool';
    import tools from 'common/js/lgc_tools';
    //import BScroll from 'better-scroll';
    import pc from 'common/js/pc.js'

    export default{
        data(){
            return{
              searchValue: '',
              folderData: [],
              videoData: [],
              imageData: [],
              selectVideoId: [],
              selectImageId: [],
              fileId: [],
              selectData: []
            }
        },
        methods:{
            //初始化數據
            init(){
              this.selectData = [];
              var data = [];
              
              //獲取當前本地的file_list數據
              data = tool.lget('file_list_'+this.$route.query.direct);

              this.selectData = data;

              this.setResults(this.selectData);
            },
            ...mapMutations({
              setSelect: 'select',
              setResults: 'results'
            }),
            arrangeSource(){

            },
            initPos(cindex,dindex){
              
              
              //重新計算位置
              this.countPos(cindex,dindex);

              //替換DOM位置
              var parent = document.getElementById('item-drag-box-wrap');
              var childs = parent.getElementsByClassName('item-drag-box');
              //console.log(cindex,dindex)
              parent.insertBefore(childs[cindex],childs[dindex]);
              
              //重新排列位置
              this.arrangePos(parent,'item-drag-box');
              //重新綁定
              this.bindDrag();  
            },
            countPos(ci,di){
              
              var data = [];
              for(var i=0;i<this.selectData.length;i++){
                data[i] = this.selectData[i];
              }
              
              var newData = [];
              var i = 0,j = 0;

              newData = data;
              if(ci > di){
                newData.splice(di,0,data[ci]);
                newData.splice(ci+1,1);
              }else{
                newData.splice(di,0,data[ci]);
                newData.splice(ci,1);
              }
              for(var i=0;i<newData.length;i++){
                this.selectData[i] = newData[i];
              }
              this.setResults(this.selectData);
            },
            arrangePos(parent,clsn,initBoolean){
              var childs = parent.getElementsByClassName(clsn);
              var bh = document.body.offsetHeight;
              var hh = 108;
              var row = 0;
              parent.style.height = bh-hh + 'px';
              row = Math.floor(parent.offsetWidth/(childs[0].offsetWidth+10));

              if(!childs[0]){
                return;
              }

              for(var i=0;i<childs.length;i++){
                childs[i].style.left = (i%row) * (childs[i].offsetWidth +10)  + 'px';
                childs[i].style.top = Math.floor(i/row) * ( childs[i].offsetHeight + 10 ) + 'px';
              }
            },
            bindDrag(){

              let box = this.$refs.cwrap;
              var childs = box.getElementsByClassName('item-drag-box');
              
              if(!childs[0]){
                return;
              }

              //檢測當前設備是移動端還是PC
              var sets = tool.etectmob();

              if(sets){
                //移動端的拖拽
                for(var i=0;i<childs.length;i++){
                  //設置拖拽
                  childs[i].index = i;
                  tools.mdrag(childs[i],childs,'desktopIcons',(cindex,index)=>{
                      this.initPos(cindex,index);
                  });
                }
              }else{

                //PC端的拖拽
                for(var i=0;i<childs.length;i++){
                  //設置拖拽
                  childs[i].index = i;
                  tools.drag(childs[i],childs,'desktopIcons',(cindex,index)=>{
                      this.initPos(cindex,index);
                  });
                }

              }
              
            },
            //上一步
            lastBtn(){
              this.$router.back(-1);
            },
            //組裝節目數據
            createStructor(data){
                var attr = {
                    "file_name":"file1",
                    "file_type":"",
                    "download_url":"",
                    "file_size":"",
                    "file_duration":""
                };

                var newArr = [];
                for(var i=0;i<data.length;i++){
                    newArr.push({
                      "img": data[i]['img'],
                      "id" : data[i]['id'],
                      "file_name": data[i]['file_name'],
                      "file_type": data[i]['file_type'],
                      "download_url": data[i]['download_url'],
                      "file_size": data[i]['file_size'],
                      "file_duration": data[i]['file_duration']
                    });
                }
                //設置素材展示的本地緩存
                tool.lset('file_list_'+this.$route.query.direct,[]);
                
                //将素材序列存在vuex状态树中
                this.stroreDataToTimeLists(newArr);

            },
            stroreDataToTimeLists(data){
              
              //判断是否为非法进入
              if(this.getTimeLists.length <=0 || this.getModelId == -1){
                this.$router.push({'path':'/pc'});
                return;
              }
              //console.log(data);
              var newArrs = pc.setFilesDataById(this.getTimeLists,this.getTimeId,this.getModelId,data);
              this.setTimeLists(newArrs);
            },  
            //提交
            nextBtn(){
              
              //首先把數據保存到本地 然後提交到數據庫
              this.createStructor(this.selectData);

              //跳轉到拖拽面板頁面
              this.$router.push({
                path: '/pc/pe',
                query: {
                  stype: 'model'
                }
              });
            },
            ...mapMutations({
              setTimeLists: 'timeList',
              setModelId: 'select_model_id'
            })
        },
        watch:{
          
        },
        computed:{
          ...mapGetters({
            'source':'source',
            'selectid': 'selectid',
            'getTimeId': 'timelist_cid',
            'getTimeLists': 'timeList',
            'getModelId': 'select_model_id'
          })
        },
        created(){
          this.init();
        },
        mounted(){
          this.arrangePos(this.$refs.cwrap,'item-drag-box');
          this.bindDrag();
        },
        components:{
          ItemView
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"                    
    
    .btnStyle{
        bgColor(#F4F4F4);color:#333;font-size:18px;initp();border-radius:10px;
     }
    .el-main
      padding-left:20px;padding-top:20px;
    .header-file
        height:108px;min-height:108px;width:100%;border-bottom:2px solid #DEDEDE;display:flex;flex-wrap:wrap;
        .grid-content
          width:50%;
        .drag-cc-title
          hh(108px);color:#333;font-size:20px;position:relative;text-indent:30px;display:block;
          &:before
            content: '';width: 9px;height: 24px;background-color: #f0b551;position: absolute;left: 0px;top: 41px;
        .searchbox
            width:60%;float:left;margin-top:34px;
            input
              @extend .btnStyle;text-indent:44px;bgImg('~common/images/source/search@2x.png');background-position:10px 7px;background-size:24px 23px;  
        .searchbtn
            width:20%;float:left;@extend .btnStyle;width:128px;hh(40px);mg(20px,34px);
        .rbtn
            float:right;margin-right:20px;margin-top:34px;width:128px;hh(40px);@extend .btnStyle;
            &:hover
              opacity:0.8;
        .uploadFile
            bgColor(#f0b551);color:#fff;
      .cwrap
        width:100%;position:relative;
    
    

    @media screen and (max-width:615px)
      .el-main
        padding:20px;
       .header-file
          height:140px;
          .drag-cc-title
            display:blobk;
          .drag-cc-title-mobile
            display:none;
          .grid-content
            width:100%;height:80px;
          .grid-content-2
            height:60px;display:flex;justify-content:center;flex-direction:row-reverse;
            .rbtn
              margin-top:0px 
          .drag-cc-title
            hh(80px);
            &:before
              top:28px;                             
</style>