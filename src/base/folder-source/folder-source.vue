<template>
   <div class="con-container">
      <div class="Column">
          
          <h3 class="column-title">文件夹</h3>
          <div v-show="sources.length==0" style="font-size:16px;color:#333;height:60px;line-height:60px;text-indent:30px;">暂无文件夹，请新建文件夹！</div>
          
          <div class="column-content">
              <dl class="cc-item" v-for="(item,index) in sources" >
                  <dt class="cc-item-previewbox" @click="gonIntoNewFolder(item.name,item.dir)">
                     <!--  <span class="cip-icon"></span>
                     <span class="cip-name">{{item.name.length<8?item.name:item.name.substr(0,8)+'...'}}</span> -->
                      
                      <span class="cip-img">
                              <img src="~common/images/source/files_img_folder.png" />
                      </span>
                      <span class="cip-img-mask"></span>
                      <span class="cip-icon cip-picon"></span>
                      <span class="cip-name">{{item.name.length<8?item.name:item.name.substr(0,8)+'...'}}</span>
                  </dt>
                  <dd class="cc-item-textbox">
                      <ul class="citms">
                          <li class="cit cit1" @click="renameFile(item.dir,item.name,item.id)">重命名</li>
                          <li class="cit cit2" @click="moveFile(item.dir,item.fileType,item.name,item.id)">移动文件夹</li>
                          <li class="cit cit3" @click="deleteFile(item.name,item.dir,item.id)">删除</li>
                      </ul>
                  </dd>
              </dl>
          </div>
          
          

      </div>
    </div>
</template>



<script scoped type="text/ecmascript-6">
    import tool from 'common/js/tool'
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import fs from './fs.js';

    export default{
        data(){
            return{
                getDatas: [],
                remove_url: this.$baseUrl+'/api/deleteFolder',
                rename_url: this.$baseUrl+'/api/renameFolder',
                url_get_sources_by_dir: this.$baseUrl + '/api/getFile',
                cdir: '/'
            }
        },
        props: {
          sources: {
            type: Array,
            default: function(){
                return []
            }
          },
          allsources:{
            type: Array,
            default: function(){
                return []
            }
          }
        },
        methods:{
          //进入文件夹页面
          gonIntoNewFolder(name,dir){
            this.cdir = dir + name + '/'; 
            this.setDir(this.cdir);
            this.$axios.post(this.url_get_sources_by_dir,{
              dir: this.dir
            }).then((res)=>{
                //success
                if(res.data.status == 'success'){
                    this.setSource(res.data.data);
                }else{
                    this.$message({
                      type: 'error',
                      message: '获取资源失败!'
                    });
                }
            });
          },
          //点击重命名文件夹
          renameFile(cdir,cname,cid){
             this.$prompt('请输入文件夹名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: cname
              }).then(({ value }) => {


                //检测value是否为空
                if(!tool.strim(value,'g')){
                   this.$message({
                      type: 'error',
                      message: '修改名称失败,名称不能爲空!'
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
                if(fs.checkFolderNameRepeat(value,tool.strim(cname,'g'),this.sources).status){ 

                    this.$message({
                      showClose: true,
                      message: fs.checkFolderNameRepeat(value,tool.strim(cname,'g'),this.sources).message,
                      type: 'error'
                    });

                    return;
                }

                //发送修改名称请求
                this.$axios.post(this.rename_url,{
                    dir: cdir,
                    foldName: cname,
                    newFoldName: value
                }).then((res)=>{

                    //success
                    if(res.data.status == 'success'){
                         this.$message({
                          type: 'success',
                          message: res.data.message
                        });

                        //修改本地数据
                        for(var i=0;i<this.source.length;i++){
                          if(this.source[i].id == cid){
                            this.source[i]['name'] = value;
                          }
                        }

                    }else{
                        this.$message({
                          type: 'error',
                          message: res.data.message
                        });
                    }
                });

              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消输入'
                });       
              });
          },
          moveFile(cdir,ctype,cname,cid){
              //向父级派发事件
              this.$emit('movefile',{'dir':cdir,'fileType':ctype,'fileName':cname,'fileId':cid});
          },
          //删除文件
          deleteFile(cname,cdir,id){
              this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {

                //请求删除操作
                //console.log(id);
                this.$axios.post(this.remove_url,{
                    name: cname,
                    dir: cdir
                }).then((res)=>{

                    //success
                    if(res.data.status == 'success'){
                         this.$message({
                          type: 'success',
                          message: '成功删除该文件夹!'
                        });

                        for(var i=0;i<this.source.length;i++){
                          if(this.source[i]['id'] == id){
                            this.source.splice(i,1);
                          }
                        }  

                    }else{
                        this.$message({
                          type: 'danger',
                          message: '文件夹删除失败!'
                        });
                    }
                });

                
               
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });          
              });
          },
          ...mapMutations({
            setSource : 'source',
            setDir: 'dir'
          })
        },
        computed:{
          ...mapGetters(['source','dir'])
        },
        mounted(){
          //console.log(this.source)
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
    .con-container
            width:100%;box-sizing:border-box;background:#fff;padding-bottom:30px;
    .Column
        width:100%;height:auto;initp();
        
        .column-title
            font-size:20px;color:#666;hh(70px);text-indent:28px;position:relative;
            &:before
                content:'';@extend .block;wh(9px,24px);bgColor(#f0b551);position:absolute;left:0px;top:23px;
        
        .column-content
            wh(100%,auto); display:-webkit-flex;display:flex;-webkit-justify-content:flex-start;justify-content:flex-start;-webkit-flex-wrap: wrap;flex-wrap: wrap;
            
            .cc-item
                wh(238px,184px);box-sizing:border-box;border:1px solid #DEDEDE;border-radius:6px 6px 0 0;margin-top:30px;margin-left:8px;
                
                .cc-item-previewbox
                    wh(236px,135px);position:relative;background:#F4F4F4;box-sizing:border-box;border-bottom:1px solid #DEDEDE;cursor:pointer;border-radius: 7px 7px 0 0;overflow:hidden;
                    .cip-img
                      wh(100%,100%);ab(0,0);
                      img
                        wh(100%,100%);
                    .cip-icon
                        wh(20px,20px);bgImg('~common/images/source/folder@2x.png');ab(14px,103px);
                    .cip-name
                        wh(100%,16px);hh(16px);ab(40px,106px);text-align:left;font-size:16px;color:#fff;  
                    .cip-img-mask
                       wh(100%,100%);ab(0,0);background-color:rgba(0,0,0,0.4);
                .cc-item-textbox
                    wh(236px,47px);bgColor(#fff);box-sizing:border-box;
                    .cit
                        float:left;width:30%;font-size:14px;color:#333;text-align:center;cursor:pointer;line-height:47px;text-indent:20px;position:relative;
                        &:before
                            content:'';display:block;wh(14px,15px);ab(8px,14px);
                        &:hover
                            text-decoration:underline;
                    .cit1
                        &:before    
                            bgImg('~common/images/source/edit@2x.png');ab(8px,16px);
                    .cit2
                        width:40%;
                        &:before    
                            bgImg('~common/images/source/move@2x.png');ab(3px,18px);background-size: contain;   
                    
                    .cit3
                        &:before    
                            bgImg('~common/images/source/delete@2x.png');ab(14px,16px);


    @media screen and (max-width:500px)
      .Column
        .column-content 
            justify-content: center;                       
</style>