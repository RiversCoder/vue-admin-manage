<template>
        <div class="source-container" ref="sourceScroll">
            <div class="sc-wrap" >
                  <div class="header-file" ref="headerFile">
                        <div class="grid-content-header">
                           <el-input v-model="searchValue" placeholder="Search" class="searchbox"></el-input>
                           <el-button plain class="searchbtn" @click.native="searchClick">搜索</el-button>
                        </div>
                        <div class="grid-content-header" v-show="true">
                           <div class="btn-contents">
                                <p style="display:none"><input name="file" type="file" value="选择" size="20" id="fileUpload1" accept="image/png,image/gif,image/jpeg,video/mp4,application/ogg, audio/ogg,video/3gpp" @change ="changeUploadFile($event)" /></p>  
                                <el-button plain class="rbtn uploadFile" @click.native="uploadFileBtn" >上传文件</el-button>
                                <el-button plain class="rbtn newFolder" @click.native="newFolder" >新建文件夹</el-button>
                                <el-button plain class="rbtn backFolder" @click.native="backLast" v-show="backBtnShow">返回上一级</el-button>
                                <el-progress :percentage="progress" class="progress-line" v-show="showProgress" color="#ed1c24"></el-progress>
                           </div>
                        </div>
                  </div>
                  
                  <!-- 目录 -->
                  <div class="catalogs" v-show="backBtnShow" ref="muluBox">
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
                        <el-scrollbar class="scrollWrapBar">
                          <div class="scrollWrap" ref="menuScroll" style="height:972px">
                              <div class="cwrap" >
                                  <folder-source @movefile="moveFileFn" :sources="folderData" :allsources="folderData"></folder-source>
                                  <video-source @movefile="moveFileFn" :videos="videoData"></video-source>
                                  <image-source @movefile="moveFileFn" :images="imageData"></image-source>
                              </div>
                          </div>
                        </el-scrollbar>
                  </el-main>
            </div>
            
         <el-dialog  :visible.sync="dialogTableVisible" >
             <el-table :data="folderSelctsData" width="500">
              <el-table-column property="name" label="文件夹名称" align="center"></el-table-column>
              <el-table-column property="name" label="点击选择" align="center">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">选择</el-button>
                  </template>
              </el-table-column>
            </el-table>
          </el-dialog>        

        </div>
</template>

 
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





<script>
    
    import FolderSource from '@/base/folder-source/folder-source';
    import VideoSource from '@/base/video-source/video-source';
    import ImageSource from '@/base/image-source/image-source';
    import tool from 'common/js/tool.js';
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import qs from 'qs';
    import sm from './sm.js'

    export default{
        data(){
            return {
                catas: [],
                input: '',
                searchValue : '',
                imageData: [],
                folderData: [],
                folderSelctsData: [],
                videoData: [],
                webDatas: [],
                url_1: this.$baseUrl + '/api/webget',
                url_2: this.$baseUrl + '/api/callbackUpload',
                url_cnew_folder: this.$baseUrl + '/api/createFolder',
                url_get_sources_by_dir: this.$baseUrl + '/api/getFile',
                url_get_search_sources: this.$baseUrl + '/api/searchFile',
                move_url: this.$baseUrl+'/api/move',
                move_folder_url: this.$baseUrl+'/api/moveFolder',
                //ossData : null,
                progress: 0,
                showProgress: false,
                onoff: true,
                cdir: '/',
                dialogTableVisible: false,
                gridData: [],
                moveFoder: {},
                backBtnShow: false,
                myBarOption:{
                  barColor:"#959595",   //滚动条颜色
                  barWidth:5,           //滚动条宽度
                  railColor:"#eee",     //导轨颜色
                  barMarginRight:0,     //垂直滚动条距离整个容器右侧距离单位（px）
                  barMaginBottom:0,     //水平滚动条距离底部距离单位（px)
                  barOpacityMin:0.3,      //滚动条非激活状态下的透明度
                  zIndex:"auto",        //滚动条z-Index
                  autohidemode:true,     //自动隐藏模式
                  horizrailenabled:false,//是否显示水平滚动条
                }
            }
        },
        methods:{
            //向数据库请求 初始化资源管理的所有数据
            initSources(pdir){
                this.setDir(pdir ? pdir : this.dir);
                this.$axios.post(this.url_get_sources_by_dir,{
                    dir: pdir ? pdir : this.dir
                }).then((res)=>{
                    //console.log(res.data)
                    if(res.data.status == 'success'){
                        this.setSource(res.data.data);
                        console.log(res.data.data)
                        //检测是否在根目录
                        this.checkDir();

                    }else{
                        this.$message({
                          type: 'danger',
                          message: '获取资源失败!'
                        });
                    }
                });
            },
            //搜索请求数据
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
                            this.setSource(res.data.data);

                        }else{
                            this.$message.error(res.data.message);
                        }
                    });
                }
            },
            //新建文件夹
            newFolder(){
              this.$prompt('请输入文件夹名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(({ value }) => {

                //检测value是否为空
                if(!tool.strim(value,'g')){
                   this.$message({
                      type: 'error',
                      message: '新建文件夹失败,名称不能爲空!'
                    });
                   return;
                }
                
                value = tool.strim(value,'g');

                //检测是否含有 \ /字符
                var re = /\\\\*|\/*/g;
                var v = value.match(re);
                for(var i=0;i<v.length;i++){
                  if(v[i]){
                    this.$message({
                        type: 'error',
                        message: '非法名称格式，名称中不能带有正反斜杠!'
                      });
                     return;
                  }
                }

                 //检测是否重名
                //1. 获取当前页面所有的文件夹名字 2. true -> 匹配到了 false -> 没有匹配到
                if(sm.checkFolderNameRepeat(value,this.folderData).status){ 

                    this.$message({
                      showClose: true,
                      message: sm.checkFolderNameRepeat(value,this.folderData).message,
                      type: 'error'
                    });

                    return;
                }

                var objs = {
                    'name' : value,
                    'type' : 'folder',
                    'content' : false,
                    'dir' : '/',
                    'src' : ''
                };
                
                //添加假数据
                this.source.push(objs);

                //向服务器发送新建文件夹请求
                var attr = {'name':value,'dir':this.dir};
                this.newFolderRequest(attr);

              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消输入'
                });       
              });
            },
            //新建文件夹请求
            newFolderRequest(attr){
                this.$axios.post(this.url_cnew_folder,attr).then((res)=>{
                    
                    //success
                    if(res.data.status == 'success'){
                        this.$message({
                          type: 'success',
                          message: '新建文件夹成功!'
                        });
                        //再次重新加载数据
                        this.initSources();
                    }

                });
            },
            //上传文件按钮
            uploadFileBtn(){
                var fileInput = document.querySelector('#fileUpload1');
                fileInput.click();
            },
            //获取钥匙
            getKey(ev){

                let file = ev.srcElement.files[0];

                //获取正常post的参数
                tool.getUploadAttr(file,this.dir,(attr)=>{
                    //console.log(attr);
                    //请求钥匙数据
                    this.$axios.post(this.url_1,qs.stringify(attr),{
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'
                          }
                    }).then((res)=>{
                        this.ossData = res.data;

                        //开始上传文件
                        this.uploadsRequest(res.data,file);

                    }).catch((err)=>{
                        console.log(err);
                    })

                });
            },
            //点击按钮 文件执行上传
            changeUploadFile(ev){

                //获取钥匙 上传文件
                this.getKey(ev);
   
            },
            //向数据库发送文件数据
            uploadsRequest(data,file){

                let form = new FormData();   
                var fname = tool.randomString(12) + tool.getBackname(file);
                var timer = null;

                var attr = {
                    'OSSAccessKeyId': data.accessid, 
                    'callback' : data.callback,
                    'key' : data.dir+fname,
                    'policy': data.policy,
                    'signature': data.signature,                  
                    'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
                    'file': file,   
                };

                for(var key in attr){
                    form.append(key,attr[key]);
                }

                var config = {
                    onUploadProgress: progressEvent => {
                        var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) 
                        this.progress = complete
                        this.showProgress = true;
                        
                        //console.log(this.progress);

                        if(this.progress == '100'){
                            this.$notify({
                              title: '成功',
                              message: '恭喜你，上传文件成功！',
                              type: 'success',
                              duration: 2500
                            });
                            this.showProgress = false;
                            //重新加载数据
                            this.initSources();
                        }

                    },
                    headers: {
                        'Content-Type':'multipart/form-data'
                    }
                }

                this.$axios.post(data.host,form,config).then((res)=>{
                    //console.log(res);
                    //重新刷新当前页面数据
                    this.initSources();
                }).catch((err)=>{
                    //console.log(err);
                });
            },
            //集中分发处理
            handleSource(){
                
                //清空数据
                this.folderData = [];
                this.imageData = [];
                this.videoData = [];
                    
                this.source.forEach((item)=>{
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

                console.log(this.videoData);
            },
            //移动文件到文件夹
            moveFileFn(attr){
                this.dialogTableVisible = true;
                this.folderSelctsData = [];

                
                //设置数据
                if(attr.fileType != 2){
                    for(var i=0;i<this.folderData.length;i++){
                        this.folderSelctsData[i] = this.folderData[i];
                    }
                    //console.log(this.folderSelctsData);
                }else{

                    //移动文件夹
                    var data = [];
                    for(i=0;i<this.folderData.length;i++){
                        data[i] = this.folderData[i];
                    }
                    for(i=0;i<data.length;i++){
                        if(data[i]['id'] == attr.fileId){
                            data.splice(i,1);
                        }
                    }
                    
                    
                    this.folderSelctsData = data;
                    //this.moveFoder['name'] = attr.fileName;
                    this.moveFoder['fileName'] = attr.fileName;
                    this.moveFoder['dir'] = attr.dir;

                }

                if(this.dir != '/'){
                    var newDir = this.dir;
                    var arr = newDir.split('/');
                    arr.splice(arr.length-2,1);
                    var lastDir = arr.join('/');
                    this.folderSelctsData.unshift({
                        dir: lastDir,
                        name: '上一级',
                        last: true
                    })
                }

                this.moveFoder['fileType'] = attr.fileType;
                this.moveFoder['fileId'] = attr.fileId;
            },
            //点击选择按钮 选择文件夹
            handleDelete(attr){

                //1. 关闭dialog
                this.dialogTableVisible = false;
                
                var cdir = '';
                if(!attr.last){
                    //2. 拼凑dir
                    cdir = this.dir+attr.name+'/';
                    this.requestCdir(cdir,false);
                }else{
                    cdir = attr.dir;
                    this.requestCdir(cdir,true);
                }

                //console.log(cdir);
                //return;
            },
            //获取当前dir文件夹信息 向服务器发送移动文件和文件夹请求
            requestCdir(cdir,onoff){

                var config = {};
                var url = '';
                var a = null;

                if(this.moveFoder.fileType != 2){
                    //配置请求host和参数
                    config = {
                        'fileId': this.moveFoder.fileId,
                        'dir': cdir
                    };
                    url = this.move_url;
                }else{
                    config = {
                        'newDir': cdir,
                        'foldName': this.moveFoder.fileName,
                        'dir': this.moveFoder.dir
                    };
                    url = this.move_folder_url;

                   
                }
               
                 //首先获取要进入文件夹的里面的文件夹数据
                sm.getFolders(this.$axios,this.$baseUrl + '/api/getFile',cdir,(datas)=>{
                   
                    //检测重名
                    var a = sm.checkFolderNameRepeat(this.moveFoder.fileName,datas); 
                    if(a.status){
                        this.$message({
                          showClose: true,
                          message: a.message,
                          type: 'error'
                        });
                        return;
                    }
                    //移动文件夹
                    this.$axios.post(url,config).then((res)=>{
                       if(res.data.status == 'success'){
                          //console.log(res.data)
                          this.$message({message: res.data.message,type: 'success'});
                          this.initSources();
                       }
                    }).catch((err)=>{
                        this.$message({message: res.data.message,type: 'error'});
                    });

                });
            },
            //返回上一级
            backLast(){
                var diss = this.dir;
                var arr = diss.split('/');
                var newArr = arr.splice(0,arr.length-2);
                var newDir = newArr.join('/')+'/';
                this.setDir(newDir);
                this.initSources(newDir);
            },
            //检测是否在根目录
            checkDir(){
              if(this.dir != '/'){
                this.backBtnShow = true;
              }else{
                this.backBtnShow = false;
              }
            },
            ...mapMutations({
                setSource: 'source',
                setDir: 'dir'
            }),
            initWrapHeight(){
                var ms = this.$refs.menuScroll;
                var hf = this.$refs.headerFile;
                var mb = this.$refs.muluBox;
                var hh = document.body.offsetHeight;
                var This = this;

                window.addEventListener('resize',fn);

                function fn(){
                    hh = document.body.offsetHeight;
                    var hf_height = hf.offsetHeight;
                    ms.style.height = hh - hf_height + 'px';
                    if(This.backBtnShow){
                        ms.style.height = (hh - hf_height - 80) + 'px';
                    }
                    //console.log(document.body.clientHeight,hf_height)
                }

                fn();
            },
            initSourceScroll(){
                var ms = this.$refs.sourceScroll;
                var hh = document.body.offsetHeight;

                window.addEventListener('resize',fn);

                function fn(){
                    hh = document.body.offsetHeight;
                    ms.style.height = hh + 'px';
                    //console.log(document.body.clientHeight,hf_height)
                }

                fn();
            },
            //渲染改变目录
            changeMulu(v){
                var data = sm.formatCatas(v);
                this.catas = data;
            },
            //刷新页面更新当前目录的文件
            requestDirMulu(dir){
                this.initSources(dir.dir);
                //sm.requestContent(this.$axios,this.$baseUrl + '/api/getFile',dir);
            }
        },
        watch: {
          source: {
            deep: true,
            handler (v) {
              this.handleSource();
            }
          },
          dir: function (v,oldVal) {
             this.changeMulu(v);
             if(v != '/'){
                this.backBtnShow = true;
              }else{
                this.backBtnShow = false;
              }
          }
          /*dir:{

            deep: true,
            handler (v) {  
              this.changeMulu(v);              
              if(v != '/'){
                this.backBtnShow = true;
              }else{
                this.backBtnShow = false;
              }
            }
          }*/
        },
        computed: {
            ...mapGetters(['source','dir'])
        },
        mounted(){
            this.initWrapHeight();
            this.initSourceScroll();
        },
        created(){

            //向数据库拿数据
            this.initSources();
           
            this.handleSource();
            
        },
        components:{
            FolderSource,
            VideoSource,
            ImageSource
        }
    }
</script>



<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
     .btnStyle{
        bgColor(#F4F4F4);color:#333;font-size:18px;initp();
     }
    
    
    .scrollWrapBar
        overflow-y:auto;
    .progress-line
        width:300px;position:absolute;bottom:3px;right:0;

    .source-container
        width:100%;height:100%;min-height:800px;overflow:hidden;
        .sc-wrap
            .header-file
                height:108px;width:100%;border-bottom:2px solid #dedede;
                .grid-content-header
                    width:50%;height:108px;float:left;position:relative;
                .searchbox
                    width:60%;float:left;margin-top:34px;margin-left: 20px;
                    input
                      @extend .btnStyle;text-indent:44px;bgImg('~common/images/source/search@2x.png');background-position:10px 7px;background-size:24px 23px;  
                .searchbtn
                    width:20%;float:left;@extend .btnStyle;width:128px;hh(40px);mg(20px,34px);
                .rbtn
                    float:right;margin-right:20px;margin-top:34px;width:128px;hh(40px);@extend .btnStyle;
                .uploadFile
                    bgColor(#f0b551);color:#fff;border:1px solid #f0b551;
                        
    
    .el-main
        background-color:none;color: #333;text-align: left;line-height: none;padding:0;
    .scrollWrap
        width:100%;background:#fff;
        .cwrap
            width:100%;height:1600px;box-sizing:border-box;height:auto;background:#fff;padding:0 30px;
    .el-header
        background-color: none;
        color: none;
        text-align: center;
        line-height: 108px;  
     
</style>


<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
    @media screen and (max-width:1256px)
      .el-main
           width:100%;
      .source-container
            .sc-wrap
                .header-file
                    height:auto;overflow:hidden;
                    .grid-content-header
                        width:100%;clear:both;hh(88px);
                        &:nth-of-type(2)
                            height:66px;
                            .rbtn
                                margin-top:0
                        .searchbox 
                            margin-top:0
                        .searchbtn 
                            margin-top:24px;    
                        .rbtn
                            float:left;
                        .uploadFile
                            margin-left: 22px;    
                            
    @media screen and (max-width:490px)
        .source-container
            .sc-wrap
                .header-file
                    height:auto;overflow:hidden;
                    .grid-content-header
                        width:100%;clear:both;hh(88px);
                        &:nth-of-type(2)
                            height:66px;
                            .rbtn
                                margin-top:0
                        .searchbox 
                            margin-top:0;width:50%;
                        .searchbtn 
                            margin-top:24px;font-size:13px;width:auto;height:auto;padding:0px 20px;margin-left:10px;margin-right:0;    
                        .rbtn
                            float:left;font-size:13px;width:auto;height:auto;padding:0px 20px;margin-left:10px;margin-right:0;
                        .uploadFile
                            margin-left: 22px;
      
                               
    @media screen and (max-width:350px)
        .source-container
            .sc-wrap
                .header-file 
                    .grid-content-header
                        .searchbox 
                            margin-top:0;width:50%;
                        .searchbtn 
                            margin-top:24px;font-size:13px;width:auto;height:auto;padding:0px 16px;margin-left:10px;margin-right:0;    
                        .rbtn
                            float:left;font-size:12px;width:auto;height:auto;padding:0px 16px;margin-left:10px;margin-right:0;
                        .uploadFile
                            margin-left: 10px;
   /* @media screen and (max-width:930px)
        .source-container
            .sc-wrap
                .header-file
                    min-height:216px;overflow:auto;
                    .grid-content-header
                        width:80%;clear:both;
                        .rbtn,.uploadFile
                            float:right;*/

</style>   