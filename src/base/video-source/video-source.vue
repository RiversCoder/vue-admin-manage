<template>
   <div class="con-container">
      <div class="Column">
          <h3 class="column-title">视频</h3>
          <div class="column-content">
                 <div v-show="videos.length==0" style="font-size:16px;color:#333;height:60px;line-height:60px;text-indent:30px;">暂无视频资源，请添加或上传视频资源！</div>
                <dl class="cc-item" v-for="(item,index) in videos" >
                      
                      <dt class="cc-item-previewbox">
                          <span class="cip-img">
                              <img :src="item.img" />
                          </span>
                          <span class="cip-icon"></span>
                          <span class="cip-name">{{item.name.length<12?item.name:item.name.substr(0,12)+'...'}}</span>
                          <span class="cip-time">{{formatTime(item.videoTime)}}</span>
                      </dt>
                      
                      <dd class="cc-item-textbox">
                          <ul class="citms">
                              <li class="cit cit1" @click="renameFile(item.dir,item.name,item.id)">重命名</li>
                              <li class="cit cit2" @click="moveFile(item.fileType,item.id)">移动文件</li>
                              <li class="cit cit3" @click="deleteFile(item.id)">删除</li>
                          </ul>
                      </dd>

                      <!-- 遮罩 -->
                      <div class="cc-con-box" v-show="false"></div>
                </dl>
             
          </div>
      </div>
    </div>
</template>


<script scoped type="text/ecmascript-6">
import tool from 'common/js/tool.js';
import {mapGetters, mapMutations, mapActions} from 'vuex';

    export default{
        data(){
            return{
                getDatas: [],
                remove_url: this.$baseUrl+'/api/deleteFiles',
                rename_url: this.$baseUrl+'/api/renameFile'
            }
        },
        props: {
          videos: {
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
          //格式化时间
          formatTime(time){

            var m = "00";
            var s = "00";
            s = time%60;
            
            if(time>60){
              m = Math.floor(time/60);
              m = m<10 ? '0'+m : m;
            }
            

            return m+':'+s;
          },
          //点击重命名文件夹
          renameFile(cdir,cname,cid){
             this.$prompt('请输入视频名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: cname
              }).then(({ value }) => {

                //检测value是否爲空
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
                
                //发送修改名称请求
                this.$axios.post(this.rename_url,{
                    fileId: cid,
                    name: value
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
                          type: 'danger',
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
          //移动文件到指定文件夹
          moveFile(type,id){
              //向父级派发事件
              this.$emit('movefile',{'fileType':type,'fileId':id});
          },
          //删除文件
          deleteFile(id){
              this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {

                //请求删除操作
                this.$axios.post(this.remove_url,{
                    'fileId': id
                }).then((res)=>{

                    //success
                    if(res.data.status == 'success'){

                         this.$message({
                          type: 'success',
                          message: '成功删除该视频!'
                        });

                        for(var i=0;i<this.source.length;i++){
                          if(this.source[i]['id'] == id){
                            this.source.splice(i,1);
                          }
                        }  

                    }else{
                        this.$message({
                          type: 'danger',
                          message: '视频删除失败!'
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
            setSource : 'source'
          })
        },
        computed:{
          ...mapGetters(['source'])
        },
        mounted(){
          
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
    .con-container
            width:100%;box-sizing:border-box;height:auto;background:#fff;padding-bottom:30px;
            
    .Column
        width:100%;height:auto;initp();
        
        .column-title
            font-size:20px;color:#666;hh(70px);text-indent:28px;position:relative;
            &:before
                content:'';@extend .block;wh(9px,24px);bgColor(#f0b551);position:absolute;left:0px;top:23px;
        
        .column-content
            wh(100%,auto); display:-webkit-flex;display:flex;-webkit-justify-content:flex-start;justify-content:flex-start;-webkit-flex-wrap: wrap;flex-wrap: wrap;
            
            .cc-con-box
               wh(236px,182px);border-radius:6px 6px 0 0;background:red;ab(0,0);bgColor(rgba(237,28,36,0.2));
               
            .cc-item
                wh(238px,184px);box-sizing:border-box;border:1px solid #DEDEDE;border-radius:6px 6px 0 0;margin-top:30px;position:relative;z-index:10;margin-left:8px;
                
                .cc-item-previewbox
                    wh(236px,135px);position:relative;background:#F4F4F4;box-sizing:border-box;border-bottom:1px solid #DEDEDE;border-radius: 7px 7px 0 0;overflow:hidden;
                    
                    .cip-icon
                        wh(20px,19px);bgImg('~common/images/source/video@2x.png');ab(14px,105px);
                    
                    .cip-name
                        wh(100%,16px);hh(16px);ab(40px,106px);text-align:left;font-size:16px;color:#fff;
                    .cip-img
                        wh(100%,100%);ab(0,0);
                        img
                          wh(100%,100%);border-radius:6px 6px 0 0; 
                    .cip-time
                      color:#fff;font-size:13px;position:absolute;bottom:10px;right:10px;            

                .cc-item-textbox
                    wh(236px,47px);bgColor(#fff);box-sizing:border-box;
                    .cit
                        float:left;width:33.3%;font-size:14px;color:#333;text-align:center;cursor:pointer;line-height:47px;text-indent:20px;position:relative;
                        &:before
                            content:'';display:block;wh(14px,15px);ab(8px,14px);
                        &:hover
                            text-decoration:underline;    
                    .cit1
                        &:before    
                            bgImg('~common/images/source/edit@2x.png');ab(8px,16px);
                    .cit2
                        &:before    
                            bgImg('~common/images/source/move@2x.png');ab(3px,16px);ab(3px,18px);background-size: contain;       
                    
                    .cit3
                        &:before    
                            bgImg('~common/images/source/delete@2x.png');ab(14px,16px);
    @media screen and (max-width:500px)
      .Column
        .column-content 
            justify-content: center; 
</style>