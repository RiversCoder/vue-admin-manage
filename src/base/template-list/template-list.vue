<template>
    <div>
       <section class="wrapper-template">
         <div class="template-box">
             <ul class="tb-lists">
               <li class="tbItem" v-for="item,index in temps" :data-type="item.type">
                 <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="listSvgBoxSelect"  viewBox="0 0 240 126" preserveAspectRatio="xMidYMid meet" ref="svgBoxItem" >
                    <g class="rectBoxWrap">
                      <rect v-for="el in item.rects" v-bind:x="el.x" v-bind:y="el.y" v-bind:width="el.w" v-bind:height="el.h"  class="rectBox"  />
                    </g>
                  </svg>
               </li>
             </ul>
         </div>
       </section>
    </div>
</template>

<script scoped>

    import svgs,{ templates } from '@/common/js/templates.js';
    import tool from 'common/js/tool';
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
    import tl from '@/common/js/pc.js';

    export default{
        data(){
            return {
              ctitle:'模板选择',
              svgBox:{
                w:240,
                h:126
              },
              newdatas: [],
              datas:[],
              temps:[]
            }
        },
        methods:{
          initActiveStates(){
            var temp = this.$store.getters.current_temp_type;
            this.initActiveState(temp);
          },
           initSvgRects(){
              this.temps = tl.formatTemplateListData(svgs,this.svgBox,templates);

           },
           //计算svg的大小
           resize(){

            var func = ()=>{
              var w = parseInt($('.listSvgBoxSelect').width());
              var h = parseInt($('.listSvgBoxSelect').height());

              this.svgBox.w = w;
              this.svgBox.h = h;

              $('.listSvgBoxSelect').attr({'width': w,'height': h,'viewBox': '0 0 '+w+' '+h });

              this.initSvgRects();
            };

            func();
            window.addEventListener('resize',func);
           },
           //初始化点击交互事件
           initEvent(){
            let This = this;
            $('.tbItem').click(function(){
              var oldType = This.$store.getters.current_temp_type;
              This.$store.commit('current_temp_type',this.dataset.type);
              This.updateTimeListType(this.dataset.type,oldType);

            });
           },
           //根据类型变化更新状态
           initActiveState(temp){
            var This = this;
             $('.tbItem').each(function(){
                if(this.dataset.type == temp){
                  $(this).addClass('tbItemActive');
                  return true;
                }
                $(this).removeClass('tbItemActive');
             });
           },
           //更新时间列表 核心 条件判断是否需要切换模板
           updateTimeListType(type,oldType){
             
             if(type == oldType){
              return;
             }

             var timeLists = this.$store.getters.timeList/*JSON.parse(JSON.stringify(this.$store.getters.timeList))*/;
             var spareTimeLists = JSON.parse(JSON.stringify(timeLists));
             var currentTimeId = this.$store.getters.timelist_cid; // 当前Active世界列表的 ID
             var currentType = this.$store.getters.current_temp_type;
             var stopFor = false;
             var onoff = true;

             if(timeLists.length <= 0 || currentTimeId == -1){
               return;
             }

             //获取当前选中的时间项
             for(var i=0;i<timeLists.length;i++){

               if(timeLists[i].id == currentTimeId){ //在已选中事件列表下，判断是否有选择资源

                if(stopFor){
                  
                  break;
                }  
                
                if(currentType != timeLists[i].template){ // 再次检测类型type是否要发生变化 如果要发生改动就往下执行

                    //提醒用户是否需要进行下一步操作
                    for(var j=0;j<timeLists[i].rects.length;j++){


                    //判断其files是否有值
                     if(timeLists[i].rects[j].files.length > 0){
                       
                       //关闭默认点击时间的开关
                       onoff = false;

                       this.$confirm('此操作将更换模板, 是否继续?', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning'
                        }).then(() => {

                          console.log('需要更换模板');

                          //1. 需要更改时间列表的template 重新渲染时间列表
                          //console.log(timeLists);
                          this.changeTimeListTemplate(spareTimeLists,currentTimeId,currentType);

                        }).catch(() => {

                          console.log('取消更换模板');

                          //1. 更改vuex状态 current_temp_type  重新渲染模板列表状态
                          this.setCurrentTemp(oldType);
                        });

                       }
                  }

                }

               }

             }

             
             if(onoff){
              //点击默认更换时间项模板
              this.changeTimeListTemplate(spareTimeLists,currentTimeId,currentType);
             }

          
           },
           changeTimeListTemplate(spareTimeLists,currentTimeId,currentType){
             var spareTimeLists = JSON.parse(JSON.stringify(spareTimeLists));
             //更新timelist里面的状态
             for(var i=0;i<spareTimeLists.length;i++){

               if(spareTimeLists[i].id == currentTimeId){ //在已选中事件列表下，判断是否有选择资源
                  
                  //如果 不满足有资源模板的情况就直接更换模板
                  spareTimeLists = tl.formatTimeListPercentDataModel(svgs,spareTimeLists,currentTimeId,currentType);
                  
                  console.log(spareTimeLists);

                  this.setTimeList(spareTimeLists);

                  break;
               }
             }
           },
           updateInitState(cid){
             var temp = tl.getTempByTimeListId(this.getTimeList,cid);
             this.initActiveState(temp);
            
             //更新状态
             this.$store.commit('current_temp_type',temp);
           },
           ...mapMutations({
            'setTimeList': 'timeList',
            'setCurrentTemp': 'current_temp_type'
           })
        },
        computed:{
          ...mapGetters({
            getTimeListId: 'timelist_cid',
            getTimeList: 'timeList',
            getCurrentTemp: 'current_temp_type'
          })
        },
        watch:{
          getTimeListId(nv,ov){
            this.updateInitState(nv);
          },
          getCurrentTemp(nv,ov){
            this.initActiveState(nv);
          }
        },
        mounted(){
          this.resize();
          this.initEvent();
          this.initActiveStates();  
        },
        created(){
          this.initSvgRects();
          
        },
        components:{

        }
    }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"    
    
    .wrapper-template
      wh(100%,auto);
      .template-box
        wh(100%,auto);
        .tb-lists
          wh(100%,auto);
          .tbItem
            wh(100%,0);padding-top:65%;box-sizing:border-box;border-bottom:1px solid #ddd;@extend .rp;
            .listSvgBoxSelect
              wh(75%,60%);border:1px solid rgba(0,0,0,0);ab(50%,50%);transform:translate3d(-50%,-50%,0);bgColor(rgba(231,231,231,1));
              .rectBox
                stroke-width:1px;stroke:#c9c9c9;fill:none;
          .tbItemActive
            bgColor(#fae2c0);
            .listSvgBoxSelect
              border-color:green;bgColor(rgba(231,231,231,0));                                               
</style>



