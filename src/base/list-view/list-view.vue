<template>
   <div class="con-container">
      <div class="Column">
         
         <!--文件夹区域-->
         <div v-if="folderExist">
            <h3 class="column-title" v-show="showFolderTitle">文件夹</h3>
            <div class="column-content" >
                <dl class="cc-item" v-for="(item,index) in folderSources" :data-dir="item.dir" :data-id="item.id">
                    <!-- <dt class="cc-item-previewbox cc-item-folder-previewbox cc-i-active" v-show="!programExist">
                        <span class="vcip-icon vcip-folder-icon"></span>
                        <span class="cip-name cip-folder-name">{{item.name.length<8?item.name:item.name.substr(0,8)+'...'}}</span>
                    </dt> -->
                    <dt class="cc-item-previewbox" v-show="!programExist">
                         <span class="vcip-img">
                             <img src="~common/images/source/files_img_folder.png" />
                         </span>
                         <span class="vcip-mask"></span>
                         <span class="vcip-icon vcip-icon-folder"></span>
                         <span class="vcip-name">{{item.name.length<10?item.name:item.name.substr(0,10)+'...'}}</span>
                   </dt>
                    <dt class="cc-item-previewbox cc-item-folder-previewbox cc-i-active" v-show="programExist" >
                            <img :src="item.img" class="programImg" />
                            <span class="programMask">{{item.name.length<8?item.name:item.name.substr(0,8)+'...'}}</span>
                    </dt>
                    <span class="maskImg2" v-show="programExist"></span>
                    <span class="maskImg" @click.stop="goIntoFolder(item.name,item.dir)" v-show="!programExist"></span>
                </dl>
            </div>
          </div>
         
        
        <!--视频区域-->
         <div v-if="videoExist">
           <h3 class="column-title">视频</h3>
           <div class="column-content" >
               <dl class="cc-item" v-for="(item,index) in videoSources" :data-id="item.id">
                   <dt class="cc-item-previewbox">
                         <span class="vcip-img">
                             <img v-if="item.img" :src="item.img" />
                         </span>
                         <span class="vcip-icon"></span>
                         <span class="vcip-name">{{item.name.length<10?item.name:item.name.substr(0,10)+'...'}}</span>
                   </dt>
                   <span class="maskImg" @click.stop="selectFn($event,item)"></span>
               </dl>
           </div>
         </div>
         

         <!--图片区域-->
         <div v-if="imageExist">
           <h3 class="column-title">图片</h3>
           <div class="column-content" >
               <dl class="cc-item" v-for="(item,index) in imageSources" :data-id="item.id">
                   <dt class="cc-item-previewbox">
                         <span class="vcip-img">
                             <img v-if="item.img" :src="item.img" />
                         </span>
                         <span class="vcip-icon icip-icon"></span>
                         <span class="vcip-name">{{item.name.length<12?item.name:item.name.substr(0,12)+'...'}}</span>
                   </dt>
                   <span class="maskImg" @click.stop="selectFn($event,item)"></span>
               </dl>
           </div>
         </div>

      

      </div>

      

    </div>
</template>




<script scoped>
    
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import tool from 'common/js/tool'

    export default{
        data(){
            return{
                titles: '图片',
                listType: 'image',
                videoDatas: [],
                recordVideo: [],
                recordImageId: [],
                showMask: true,
                cdir: '/'
            }
        },
        props: {
          showFolderTitle:{
            type: Boolean,
            default: false
          },
          imageExist:{
            type: Boolean,
            default: false
          },
          folderExist:{
            type: Boolean,
            default: false
          },
          videoExist:{
            type: Boolean,
            default: false
          },
          imageSources: {
            type: Array,
            default: function(){
                return []
            }
          },
          folderSources: {
            type: Array,
            default: function(){
                return []
            }
          },
          videoSources: {
            type: Array,
            default: function(){
                return []
            }
          },
          rs:{
            type: String,
            default:''
          },
          programExist:{
            type: Boolean,
            default: false
          }
        },
        initSelects(){
          
        },
        methods:{

          //点击后操作
          selectFn(ev,d){
            var item = ev.srcElement || ev.target;
            //console.log(item,this.rs,d);
            var data = tool.getSelect(item,'cactive',this.rs,d);
            //console.log(data);
          },
          //点击重新渲染当前页面
          goIntoFolder(name,dir){
            var newDir = dir + name + '/' ;

            //向父级页面发送请求 需要重新加载数据
            this.$emit('freshPage',newDir);            
          },
          ...mapMutations({
            setSelect:'select'
          })
        },
        computed:{
          ...mapGetters(['results'])
        },
        mounted(){
          //console.log(this.imageSources)
        }
    }
</script>

<style type="text/css">
  .el-main{
    padding: 0;
  }
</style>

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
                wh(238px,135px);position:relative;box-sizing:border-box;border:1px solid #DEDEDE;border-radius:10px;margin-top:30px;margin-left:8px;cursor:pointer;
                
                .cc-item-previewbox
                    wh(236px,133px);position:relative;box-sizing:border-box;overflow:hidden;
                    
                    /* 已经存在的文件夹 */
                    .cip-icon
                        wh(32px,28px);bgImg('~common/images/source/folder_copy.png');abcenterX(50%,59px,-16px);
                    .cip-name
                        wh(100%,16px);hh(16px);font-weight:bold;color:#fff;font-size:16px;abcenterX(0,59px,0);text-align:center;
                    .cip-img
                        wh(236px,134px);border-radius:10px;
                    
                    /* 视频 */
                    .vcip-icon
                        wh(20px,19px);bgImg('~common/images/source/video@2x.png');ab(14px,105px);
                    .vcip-name
                        wh(100%,16px);hh(16px);ab(40px,106px);text-align:left;font-size:16px;color:#fff;
                    .vcip-img
                        wh(100%,100%);ab(0,0);
                        img
                          wh(100%,100%);border-radius:10px;             
                    .vcip-icon-folder
                      bgImg('~common/images/source/folder@2x.png');
                    .vcip-mask
                      wh(100%,100%);ab(0,0);bgColor(rgba(0,0,0,0.4));border-radius:10px;  
                    /* 图片 */
                      
                    .icip-icon
                        wh(19px,19px);bgImg('~common/images/source/img@2x.png');
                    .vcip-folder-icon
                        bgImg('~common/images/source/folder_copy.png');ab(103px,36px);wh(32px,28px);
                    .cip-folder-name
                        color:#333;fonts-size:16px;top:81px;
                        

                    /* 节目 */
                    .programImg
                       wh(100%,100%);ab(0,0);border-radius:10px;
                    .programMask
                       wh(100%,100%);ab(0,0);border-radius:10px;bgColor(rgba(0,0,0,0.6));color:#fff;font-size:16px;text-align:center;line-height:134px;        

                .cc-item-folder-previewbox
                    bgColor(#F4F4F4);border:1px solid #f4f4f4;border-radius:10px;
                          
              .maskImg,.maskImg2
                display:block;wh(238px,135px);box-sizing:border-box;border-radius:10px;border:4px solid #5E8CEE;bgColor(#fff);opacity:0;ab(0,0);
            .cactive
                .maskImg2,.maskImg
                  opacity:0.7;
                .cc-item-previewbox
                  .cip-name
                    color:#333;
                    
    @media screen and (max-width:600px)
      .Column
        .column-content 
            justify-content: center;
            .cc-item
              margin-left:0;             
</style>