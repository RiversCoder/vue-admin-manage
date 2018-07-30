<template>
   <div class="con-container" ref="menuScroll">
     
      <div >
      <header class="header-file" ref="headerFile" style="min-height:108px;">
            <div class="hf-box hf-serch-box">
                <div class="grid-content">
                   <el-input v-model="searchValue" placeholder="Search" class="searchbox"></el-input>
                   <el-button plain class="searchbtn" @click.native="searchClick">搜索</el-button>
                </div>
            </div>
            <div class="hf-box hf-btn-box">
                <div class="grid-content">
                    <p style="display:none"><input name="file" type="file" value="选择" size="20" id="fileUpload1" accept="image/png,image/gif,image/jpeg,video/mp4,application/ogg, audio/ogg,video/3gpp" @change ="changeUploadFile($event)" /></p>  
                    <el-button plain class="rbtn newFolder" @click.native="nextBtn">下一步</el-button>
                    <el-button plain class="rbtn newFolder" @click.native="lastBtn">上一步</el-button>
                    <el-button plain class="rbtn uploadFile" @click.native="backLast" v-show="backBtnShow">返回上一级</el-button>
                </div>
             </div>
      </header>
      
       <!-- 目录 -->
      <div class="catalogs" v-show="backBtnShow">
            <span class="cl-fixed"><i class="ci-icon"></i>文件夹 <i class="ci-line">|</i> </span>
            <span class="cl-mulu">
                <ul class="floder-lists" >
                    <!-- <li class="list-item"> <span class="fname">所有文件</span> <span class="segmentation">></span></li> -->
                    <li class="list-item" v-for="item in catas" @click="requestDirMulu(item)"> 
                        <span class="fname">{{item.name}}</span> <span class="segmentation">></span>
                    </li>
                </ul>
            </span>
      </div>   

      <el-main>
            
              <div class="cwrap" ref="cwrap" style="overflow:hidden;" >
                <el-scrollbar class="el-scrollbar-wrap">
                    <div class="cwrap_box">
                      <list-view @freshPage="freshData" :folderExist="true" :folderSources="folderData"></list-view> 
                      <list-view :rs="$route.query.direct"  :videoExist="true" :videoSources="videoData"></list-view>
                      <list-view :rs="$route.query.direct"  :imageExist="true" :imageSources="imageData"></list-view>
                    </div>
                </el-scrollbar>
              </div>
           
      </el-main>
    </div>
    
   </div>
</template>






<script scoped>
    
    import ListView from '@/base/list-view/list-view';
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
    /*import datas from 'common/js/data';*/
    import tool from 'common/js/tool';
    import pc from 'common/js/pc.js';

    export default{
        data(){
            return{
              catas: [],
              searchValue: '',
              folderData: [],
              videoData: [],
              imageData: [],
              selectVideoId: [],
              selectImageId: [],
              backBtnShow: false,
              fileId: [],
              url_get_sources_by_dir: this.$baseUrl + '/api/getFile',
              get_all_files: this.$baseUrl+'/api/getAllFileInfo', 
              url_get_search_sources: this.$baseUrl + '/api/searchFile',
              dir: '/',
              existData: [],
              render_success: false,
              timer: null,
              cFiles: []
            }
        },
        methods:{
            //向数据库请求 初始化资源管理的所有数据
            initSources(pdir){
                this.setDir(pdir ? pdir : this.dir);
                this.dir = pdir ? pdir : this.dir;
                this.$axios.post(this.url_get_sources_by_dir,{
                  dir: pdir ? pdir : this.dir
                }).then((res)=>{
                    
                    if(res.data.status == 'success'){
                        
                        //获取当前目录下的数据
                        this.setSource(res.data.data);

                        //检测是否在根目录 显示隐藏返回上一级按钮
                        this.checkDir();

                        //分配数据
                        this.init();

                        //初始化被选择的数据
                        this.initSelectData();

                        this.render_success = Math.random();

                    }else{
                        this.$message({
                          type: 'error',
                          message: '获取资源失败!'
                        });
                    }
                });
            },
            //初始化当前位置下已经选择的数据
            initSelectedData(){
              this.cFiles = pc.getFilesDataById(this.getTimeLists,this.getModelId);
              console.log(this.cFiles);
              tool.lset('file_list_',this.cFiles);
            },
            //点击搜索
            searchClick(){
              let svalue = this.searchValue.replace(/(^\s*)|(\s*$)/g, "");
               
                //验证是否为空
                if(svalue == ''){
                    this.initSources();
                }else{
                    this.$axios.post(this.url_get_search_sources,{
                    fileName: svalue
                    }).then((res)=>{
                        if(res.data.status == 'success'){
                            console.log(res.data.data)
                            this.setSource(res.data.data);
                            this.init();
                        }else{
                            this.$message.error(res.data.message);
                        }
                    });
                }
            },
            init(){
              var arr = this.source;
              
              //清空数据
              this.folderData = [];
              this.imageData = [];
              this.videoData = [];
              
              arr.forEach((item)=>{
                  //console.log(item);
                  switch(item.fileType){
                      case 2 :
                          this.folderData.push(item);
                      break;
                      case 0 :
                          this.imageData.push(item);
                      break;
                      case 1 :
                          this.videoData.push(item);
                      break;    
                  }
              });
            },
            //上一步
            lastBtn(){

              //当前页面直接后退
              this.$router.back(-1);
            },
            //下一步
            nextBtn(){

              //检测是否具备跳转的条件
              var data = tool.lget('file_list_');
              
              if(data.length == 0){
                this.$message({
                  showClose: true,
                  message: '没有选择文件！',
                  type: 'error'
                });
                return;
              }
                 
              //console.log(this.$route.query.direct)

              //跳转到拖拽面板页面
              this.$router.push({path:'/pc/order',query:{direct:this.$route.query.direct}})    
            },
            ...mapMutations({
              setSource: 'source',
              setSelect: 'select',
              setSdir: 'sdir',
              setDir: 'dir'
            }),
            countHeight(){
              var box = this.$refs.cwrap;
              var h = document.body.offsetHeight - 108;
              box.style.height = 1080 + 'px';
            },
            //返回上一级
            backLast(){

                //重新当前目录是否有数据更新
                //tool.checkIsUpdate('cc-item','cactive',this.source,this.$route.query.direct)

                //跳转目录
                var diss = this.dir;
                var arr = diss.split('/');
                var newArr = arr.splice(0,arr.length-2);
                var newDir = newArr.join('/')+'/';
                this.dir = newDir;
                this.initSources(newDir);

            },
            //重新加载数据
            freshData(pdir){
              //保存当前的
              this.initSources(pdir);
              this.dir = pdir;
            },
            //检测是否在根目录
            checkDir(){
              if(this.dir != '/'){
                this.backBtnShow = true;
              }else{
                this.backBtnShow = false;
              }
            },
            //初始化已经被选中的数据
            initSelectData(){
                var boxs = null;
                var t1 = new Date().getTime();
                var t2 = 0;

                clearInterval(this.timer);

                for(var i=0;i<10000;i++){
                  clearInterval(i);
                }

                if(this.render_success){
                    this.timer = setInterval(()=>{
                      this.existData = tool.lget('file_list_');
                      //console.log(this.existData);
                      boxs = document.getElementsByClassName('cc-item');
                      
                      //清除所有
                      for(var m=0;m<boxs.length;m++){
                        boxs[m].classList.remove('cactive');
                      }
                      if(!this.existData){
                        return;
                      }

                      //添加当前
                      for(var i=0;i<this.existData.length;i++){
                        for(var j=0;j<boxs.length;j++){
                          if(this.existData[i]['id'] == boxs[j].dataset.id){
                            boxs[j].classList.add('cactive');
                          }
                        }
                      }
                      
                      t2 = new Date().getTime();
                      if(t2 - t2 > 800){
                        clearInterval(this.timer);
                      }

                    },50);

                    tool.sset('timer',this.timer);
                }
            },
            initWrapHeight(){
                var ms = this.$refs.menuScroll;
                //var hf = this.$refs.headerFile;
                var hh = document.body.offsetHeight;
                var hf_height = 0;
                ms.style.overflow = 'hidden';
                

                function fn(){
                    hh = document.body.offsetHeight;
                    ms.style.height = hh - hf_height+ 'px';
                    //console.log(document.body.clientHeight,hf_height)
                }

                fn();

                window.addEventListener('resize',fn);
            },
            initCwrapHeight(){
                var ms = this.$refs.cwrap;
                var hf = this.$refs.headerFile;
                var hh = document.body.offsetHeight - hf.offsetHeight;
                var hf_height = 0;
                ms.style.overflow = 'hidden';
                

                function fn(){
                    ms.style.height = (document.body.offsetHeight - hf.offsetHeight ) + 'px';
                }

                fn();

                window.addEventListener('resize',fn);
            },
            //格式化当前的目录
            formatCatas(dirs){
                var obj = {
                    name: '',
                    dir: '',
                }
                var arr = [];
                var str = '/';
                var dirArr = [{
                    name: '所有文件',
                    dir: '/'
                }];
                

                //格式化dir成数组
                arr = dirs.split('/');
                for(var i=0;i<arr.length;i++){
                    if(!arr[i]){
                        arr.splice(i,1);
                    }
                }

                //再次格式化
                for(i=0;i<arr.length;i++){
                    str += (arr[i]+ '/');
                    dirArr.push({
                        'name': arr[i].length<=5?arr[i]:arr[i].substr(0,3)+'..',
                        'dir': str
                    });
                }

                return dirArr;
            },
            //渲染改变目录
            changeMulu(v){
                var data = this.formatCatas(v);
                this.catas = data;
            },
            //刷新页面更新当前目录的文件
            requestDirMulu(dir){
                this.initSources(dir.dir);
                //this.dir = dir;
                //sm.requestContent(this.$axios,this.$baseUrl + '/api/getFile',dir);
            }
        },
        watch:{
          render_success:function(nw,ow){
            this.initSelectData();
          },
          dir: function (v,oldVal) {
             //console.log(v);
             this.changeMulu(v);
             if(v != '/'){
                this.backBtnShow = true;
              }else{
                this.backBtnShow = false;
              }
          }
        },
        computed:{
          ...mapGetters({
            source: 'source',
            getTimeLists: 'timeList',
            getModelId: 'select_model_id'
          })
        },
        created(){
          //默认加载根目录的数据
          this.initSources();
        },

        mounted(){
          
          //配合滚动计算高度
          //this.countHeight();

          //判断是否已经有数据被选择
          //console.log(tool.lget('file_list_'+this.$route.query.direct));
          
          if(tool.lget('file_list_'+this.$route.query.direct)){
            this.existData = tool.lget('file_list_'+this.$route.query.direct);
            
            //新：初始化已经选中状态的数据
            this.initSelectedData();

            //旧：初始化已经选中状态的数据
            this.initSelectData();
          }

          

          this.initWrapHeight();

          this.initCwrapHeight();

        },
        components:{
          ListView
        }
    }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">

    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"   
                     
    .el-scrollbar-wrap
        height:100%;
        .el-scrollbar__wrap
            overflow-y:auto;
    .btnStyle{
        bgColor(#F4F4F4);color:#333;font-size:18px;initp();border-radius:5px;
     }
    .header-file
        min-height:108px;width:100%;border-bottom:2px solid #dedede;
        .hf-box
          width:50%;height:108px;float:left;
          .searchbox
              width:60%;float:left;margin-top:34px;margin-left:10px;
              input
                @extend .btnStyle;text-indent:44px;bgImg('~common/images/source/search@2x.png');background-position:10px 7px;background-size:24px 23px;  
        .searchbtn
            width:20%;float:left;@extend .btnStyle;width:128px;hh(40px);mg(20px,34px);
        .rbtn
            float:right;margin-right:20px;margin-top:34px;width:128px;hh(40px);@extend .btnStyle;
        .uploadFile
            bgColor(#f0b551);color:#fff;      
      .cwrap
        width:100%;height:auto;
        .cwrap_box
          width:100%;height:auto;
    .el-main
      padding:0;padding-left:20px;box-sizing:border-box; 
      

    @media screen and (max-width:1260px)
      .el-main
        padding:0
      .header-file
        overflow:hidden;
        .hf-box
          width:100%;line-height:80px;height:80px;float:none; 
          &:nth-of-type(2)
            height:60px;line-height:60px;position:relative;
            .grid-content
              flex-direction:row-reverse;justify-content:flex-end;
            .rbtn
              margin-top:0;
              &:nth-of-type(1)
                margin-left:10px;
          .grid-content
            width:100%;display:flex;justify-content:flex-start;flex-direction:row;   
          .searchbox
            margin-top:0;width:50%;
          .searchbtn  
            margin-top:20px;        
</style>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .catalogs
        width:100%;height:60px;font-size:18px;line-height:32px;display:inline-block;box-sizing:border-box;padding-top:20px;padding-top:20px;padding-left:10px;
        .cl-fixed
            float:left;width:120px;color:rgba(66,66,66,.5);position:relative;padding-left:20px;text-indent:28px;
            .ci-line
                font-size:10px;font-style:normal;position:relative;top:-3px;margin-left:10px;
            &:before
                content:'';display:block;width:20px;height:20px;background-image:url('~common/images/source/folder_copy.png');background-repeat:no-repeat;background-size:100% 100%;position:absolute;top:4px;
        .cl-mulu
            float:left;width:80%;overflow:hidden;  
            .floder-lists
                width:100%;
                .list-item
                    float:left;color:rgba(66,66,66,.5);margin-right:8px;transition:.3s;cursor:pointer;
                    &:hover
                        color:rgba(66,66,66,1);
                        .fname
                            text-decoration:underline;       
                    &:last-child
                        color:#424242;cursor:default;
                        .segmentation
                            display:none;    
                     
    @media screen and (max-width:700px)
       .catalogs 
            font-size:16px;height:50px;line-height:50px;padding-top:5px;
            .cl-fixed
               display:none;
            .cl-mulu
                padding-left:10px;width:100%;box-sizing:border-box;  
                
    @media screen and (max-width:370px)
       .catalogs 
           display:none;              
</style>