<template>
    <div>
      <div class="ss-wrapper">

        <div class="ss-box" >
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="listSvgBoxView"  viewBox="0 0 240 126" preserveAspectRatio="xMidYMid meet" ref="svgBoxItem" @click="goToNextPage">
            <g class="rectBoxWrap">
              <rect v-for="el in svgData" v-bind:x="el.x" v-bind:y="el.y" v-bind:width="el.w" v-bind:height="el.h"  class="rectBox"  />
            </g>
            <g class="rectBoxWrap">
              <image v-show=" el.src ? true : false "  v-for="el in svgData" v-bind:xlink:href="el.src" :x="el.x" :y="el.y" :height="el.h" :width="el.w" preserveAspectRatio="xMidYMid  slice " /> 
            </g>
          </svg>
          <p class="infoText">建议视频、图片尺寸：16：9</p>
        </div>
      </div>

    </div>
</template>

<script scoped>
    
    import svgs,{ templates } from '@/common/js/templates.js';
    import tool from 'common/js/tool';
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
    import ss from '@/common/js/pc.js';
   

    export default{
        data(){
            return {
              ctitle:'资源选择',
              svgBox:{
                w:460,
                h:300
              },
              svgData:[],
              imgArr:[{src:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531394286879&di=57365b4c97223f190b17b5d2d5edb39c&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D3703980863%2C363733422%26fm%3D214%26gp%3D0.jpg'},{src:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531394317796&di=882eb5e7e8e50760a64772d062a9dda3&imgtype=0&src=http%3A%2F%2Fup.enterdesk.com%2Fedpic_source%2Fe9%2Ff4%2F92%2Fe9f4927090a90bbd39f04952fc2428e9.jpg"},{src:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531394317794&di=9b70911df906e15c977ddcafe1e1a812&imgtype=0&src=http%3A%2F%2Fimg02.tooopen.com%2Fimages%2F20160428%2Ftooopen_sy_160798945471.jpg'},{src:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531394317793&di=bf5169f88eac19456d7d35984fd3dc11&imgtype=0&src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F13%2Fe1%2Fcb%2F13e1cb294bc80f1035ff3bca018edae8.jpg'}]
            }
        },
        methods:{
            initData(){
              this.svgData = ss.formatTemplateData(this.getCtype,this.svgBox,templates);
              this.imgArr = ss.getRectsImgsByTid(this.getTimeList,this.getTimelistCid);

              for(var i=0;i<this.svgData.length;i++){
                this.svgData[i] = {...this.svgData[i],...this.imgArr[i]};
              }

              //需要获取当前激活的时间列表项
              //console.log(this.svgData)
            },

            //计算svg的大小
            resize(){
              //window.addEventListener('resize',this.setSvgData);
            },

           setSvgData(){
              var w = parseInt($('.listSvgBoxView').width());
              var h = parseInt($('.listSvgBoxView').height());
              //console.log(w,$('.listSvgBoxView').height());
              this.svgBox.w = w;
              this.svgBox.h = h;

              $('.listSvgBoxView').attr({'width': w,'height': h,'viewBox': '0 0 '+w+' '+h });

              this.initData();
           },
           //去到节目编辑页面
           goToNextPage(){
            
            //1. 需要判断当前timeList是否为空  && timelist_cid 的值是否为-1
            if(this.getTimeList.length <= 0){
              //提示需要添加时间项
              this.$message({
                showClose: true,
                message: '还未添加时间，请添加时间项！',
                type: 'warning'
              });
              return;
            }else{



              if(this.getTimelistCid == -1){
                //提示需要选择时间项
                this.$message({
                  showClose: true,
                  message: '请选择时间项！',
                  type: 'warning'
                });
                return;
              }else{

                //检测是否有文件选中
                //console.log(this.svgData);
                var onoff = false;
                for(var i=0;i<this.svgData.length;i++){
                  if(this.svgData[i].src){
                    onoff = true;
                  }
                }

                if(onoff){
                    //需要弹窗
                  this.$confirm('此操作将删除该时间模板下内容, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.$router.push({
                      path: '/pc/pe'
                    });
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消操作'
                    });          
                  });
                }else{
                  this.$router.push({
                      path: '/pc/pe'
                  });
                }

              }
              
            }

            //去到模板编辑页面
           }
        },
        computed:{
          ...mapGetters({
            getCtype : 'current_temp_type',
            getTimelistCid: 'timelist_cid',
            getTimeList: 'timeList'
          })   
        },
        watch:{
            getCtype: function(v1,v2){
              //console.log(v1,v2);
              //console.log(this.getCtype)
              //this.$store.commit('current_temp_type',v2);
              //this.initData();
              this.setSvgData();
            },
            getTimeList: {
              handler(v1,v2){
                this.setSvgData();
              },
              deep:true
            },
            getTimelistCid(v1,v2){

              this.setSvgData();
            }
        },
        mounted(){
          this.setSvgData();
          this.resize();
        },
        created(){
          this.initData();   
        },
        components:{

        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"    
    
    .ss-wrapper
      wh(100%,auto);
      .ss-box
        wh(100%,0);padding-top:65.8%;@extend .rp;border:3px dashed #ccc;box-sizing:border-box;
        .listSvgBoxView
          ab(50%,50%);wh(58%,43%);border:1px solid red;transform:translate3d(-50%,-50%,0);border-color:green;bgColor(rgba(231,231,231,1));cursor:pointer;
          .rectBox
            stroke-width:1px;stroke:#c9c9c9;fill:none;    
        .infoText
          width:100%;color:#555555;text-align:center;ab(0,80%);font-size:14px; 
                                                     
</style>


