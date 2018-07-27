<template>
    <div>
        <div class="ib-wrapper">
           <div class="ib-box" id="ib-box">
               
              <div class="ib-box-svg">
                <div v-for="item,index in svgData" class="ibs-item"  :data-mid="item.mid" :style="`width:${item.w};height:${item.h};left:${item.x};top:${item.y};line-height:${item.h};`" ><span class="ib-posText">位置{{index+1}}</span></div>
              </div>
              

              <div class="ib-svg-box-mask" v-if=" getModelType != 'model' "></div>

             <div :class=" item.contentType=='text'? 'ibs-drag ibs-drag-text' : 'ibs-drag ibs-drag-img' " v-for="item,index in dragBoxs" :style="`width:${item.w};height:${item.h};left:${item.l};top:${item.t};z-index:${item.zIndex}`" :data-index="index" :data-style="item.style" :data-id="item.oid">
                <img v-if=" item.contentType=='img' "  class="ibsd-img" :src="item.content"  />
                <p v-if=" item.contentType=='text' " class="ibsd-text">{{item.content}}</p>
                <span v-if=" item.contentType=='img' " class="ibs-drag-zoom" ></span>
                <i class="el-icon-close ibs-drag-close" @click="deleteDragBox(item,index)"></i>
             </div> 

              <!-- <div class="ibs-drag ibs-drag-text">
                <span class="ibs-drag-zoom"></span>
                <i class="el-icon-close ibs-drag-close" ></i>
                           </div>  -->
            <p class="testContentText" style="width:auto;height:auto;opacity:0;visibility:hidden;position:fixed;bottom:0;right:0;font-size:16px;"></p>   
           </div>

        </div>
    </div>
</template>

<script>
    
    import tool from 'common/js/tool';
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
    import svgs,{ templates } from '@/common/js/templates.js';
    //import ss from '@/common/js/pc.js';
    import toolDom from '@/common/js/tool.dom.js';
    import pc from 'common/js/pc.js'

    export default{
        data(){
            return {
              svgBox:{
                w:0,
                h:0
              },
              drags: [/*{content:'http://p1.wmpic.me/article/2017/09/20/1505873790_jAifMQjC.jpg',type:'img'},{content:'content 大家好呀',type:'text'}*/],
              dragBoxs:[], 
              svgData: [],
              defaultWh:{
                w: 1560,
                h: 910
              },
              globalIndex:5,
              showPosData: { x:0, y:0, w:0, h:0 }
            } 
        },
        methods:{

            initDragBoxs(){
              //console.log(this.dragBoxs,this.getAllDragBoxData);
              this.dragBoxs = this.getAllDragBoxData;
            },
            initActive(){
              console.log('123',this.$route.query.mid);
              if(this.$route.query.mid){
                this.setActiveClass(this.$route.query.mid);
              }
            },  
            initData(){
              
              //1. 初始化形状盒子对象
              this.svgData = pc.formatTemplateData(this.getCtype,this.svgBox,templates);
              
              //2. 初始化
              /*var dragsBox = pc.getAllDragBoxData(this.getTimeList,this.getCid);
              this.dragBoxs = dragsBox;
              this.setAllDragBoxData(dragsBox);*/
              //console.log(this.$route.query.stype);
              if(this.$route.query.stype != 'model'){
                var timeList = pc.deleteAllDragBoxData(this.getTimeList,this.getCid);
                this.setTimeList(timeList);
              }


              
            },

            //计算svg的大小
            resize(){
              //window.addEventListener('resize',this.setSvgBoxData);
            },
            //设置形状盒子宽高
           setSvgBoxData(){
              var w = parseInt($('.ib-box-svg').width());
              var h = parseInt($('.ib-box-svg').height());

              this.svgBox.w = w;
              this.svgBox.h = h;

              this.defaultWh.w = parseInt($('.ib-box').width());
              this.defaultWh.h = parseInt($('.ib-box').height());

              this.initData();
           },
           //设置包裹盒子宽高
           setWrapperBoxInit(){
              var w = parseInt($('.ib-box-svg').width());
              var h = parseInt($('.ib-box-svg').height());

              this.svgBox.w = w;
              this.svgBox.h = h;

              this.defaultWh.w = parseInt($('.ib-box').width());
              this.defaultWh.h = parseInt($('.ib-box').height());
           },
           initModelEvent(){
            var This = null;
            var that = this;
            $('.ibs-item').click(function(e){
              
              if(This){
                This.removeClass('selectActive');
              }

              //给状态树添加当前位置状态
              that.$store.commit('select_model_id',$(this).get(0).dataset.mid);

              $(this).addClass('selectActive');
              This = $(this);

              e.stopPropagation();
              e.preventDefault();
              return false;
            })
           },

           //初始化可拖拽元素
           initDragData(){
           
            let arr = [];
            var imgFunc = null;
            var This = this;

            if(this.drags.length <= 0){
              return;
            }

            for(let i=0;i<this.drags.length;i++){

                this.globalIndex++;

                if(this.drags[i].type === 'img'){
                  //console.log('here')
                  var img = new Image();
                  img.src = this.drags[i].content;
                  img.index = i;
                  imgFunc = new Promise(function(resolve, reject){
                      img.onload = function(){

                        resolve({
                          w: toolDom.countPercent(this.width/This.defaultWh.w),
                          h: toolDom.countPercent(this.height/This.defaultWh.h),
                          content: This.drags[this.index].content,
                          type: This.drags[this.index].ctype,
                          style: This.drags[this.index].style,
                          l: toolDom.countPercent((This.defaultWh.w - this.width)/This.defaultWh.w * 0.5),
                          t: toolDom.countPercent((This.defaultWh.h - this.height)/This.defaultWh.h * 0.5),
                          contentType: 'img',
                          zIndex: This.globalIndex,
                          oid: This.drags[this.index].oid
                        });

                      }

                  });

                  

                }else if(this.drags[i].type === 'text'){

                  var p = document.getElementsByClassName('testContentText')[0] ;
                  p.innerHTML = this.drags[i].content;
                  console.log(p.offsetWidth,p.offsetHeight);

                  var t1 = setTimeout(()=>{
                    var w = toolDom.countPercent(p.offsetWidth/This.defaultWh.w);
                    var h = toolDom.countPercent(p.offsetHeight/This.defaultWh.h);
                    var l = toolDom.countPercent((This.defaultWh.w - p.offsetWidth)/This.defaultWh.w * 0.5);
                    var t = toolDom.countPercent((This.defaultWh.h - p.offsetHeight)/This.defaultWh.h * 0.5);
                    
                    this.dragBoxs.push({
                      'w': w,'h': h,'l':l,'t':t,contentType: 'text',content:this.drags[i].content,zIndex: This.globalIndex,oid: This.drags[i].oid,text:this.drags[i].content
                    });

                    //console.log(this.dragBoxs)
                    this.dragBoxs = pc.removeRepeat(this.dragBoxs);
                    this.setAllDragBoxData(this.dragBoxs);
                    
                    //clearTimeout(t1);

                  },500);
                }

              }


              //数组去重复
              //this.dragBoxs = new Set(this.dragBoxs);
              if(imgFunc){
                imgFunc.then((data)=>{
                  this.dragBoxs.push(data);
                  //去重复
                  this.dragBoxs = pc.removeRepeat(this.dragBoxs);
                  //var arr = this.getDragBoxs
                  this.setAllDragBoxData(this.dragBoxs);
                });
              }
              
              //console.log(this.dragBoxs);
              //去重复
              //this.dragBoxs = pc.removeRepeat(this.dragBoxs);

           },
           //初始化拖拽默认事件
           initDargEvent(){

             var This = this;

             var timer = new Promise((resolve,reject)=>{
               var t = setTimeout(()=>{
                resolve();
                window.clearTimeout(t);
               },500);
             }); 
            
             timer.then(()=>{

              $('.ibsd-img').mousedown(function(e){
                e.preventDefault();
              });

              // 拖拽
              $('.ibs-drag').each(function(index,elem){
                
                // 拖拽移动
                toolDom.drag({
                    'target': elem,
                    'parent': true,
                    'parentWH': This.defaultWh,
                    'mouseup': (id,x,y) => { 
                      This.dragBoxs = pc.getNewDragDatasByPos(This.dragBoxs,{id,x,y,dwh:This.defaultWh});
                      //console.log(This.dragBoxs);
                      /*This.dragBoxs[index]['l'] = toolDom.countPercent(x/This.defaultWh.w);
                      This.dragBoxs[index]['t'] = toolDom.countPercent(y/This.defaultWh.h);
                      //console.log(This.defaultWh,This.dragBoxs);*/
                    },
                    'mousemove':(x,y,w,h)=>{
                      This.showPosData.x = x;
                      This.showPosData.y = y;
                    },
                    'mousedown':(w,h)=>{
                      This.showPosData.w = w;
                      This.showPosData.h = h;
                    }
                });

              })

              // 缩放      
              $('.ibs-drag-zoom').each(function(index,elem){

                // 放大缩小  
                 toolDom.dragZoomDOM({
                  'target': elem,
                  'parentcls': elem.parentNode.className,
                  'wrapper': $('#ib-box'),
                  'end':(id,w,h)=>{
                    This.dragBoxs = pc.getNewDragDatas(This.dragBoxs,{id,w,h});
                    //console.log(This.dragBoxs);
                  },
                  'mousemove':(w,h)=>{
                    This.showPosData.w = w;
                    This.showPosData.h = h;
                  }
                 }); 

              })

             });
           },
           //删除可拖拽盒子
           deleteDragBox(el,index){

             for(var i=0;i<this.dragBoxs.length;i++){
               if(this.dragBoxs[i].oid == el.oid){
                this.dragBoxs.splice(i,1);
                break;
               }
             }

             var newArr = pc.deleteItemById(el.oid,this.getDragBoxs);
             //console.log(newArr);
             this.setDragBoxs(newArr);
           },
           //初始化所有事件
           initEvent(){
             this.initDragData();
             this.initDargEvent();
             this.initModelEvent();
           },
           setActiveClass(mid){
                $('.ibs-item').each(function(index,elem){
                    $(elem).removeClass('selectActive');
                    
                    if(elem.dataset.mid == mid){
                      $(this).addClass('selectActive');
                    }
                })
            },
          ...mapMutations({
              setTimeList: 'timeList',
              setDragBoxs: 'dragBoxs',
              setXYWH: 'setPosWidth',
              setAllDragBoxData: 'getAllDragBoxData'
          })
        },
        computed:{
          ...mapGetters({
             getTimeList: 'timeList',
             getCid: 'timelist_cid',
             getCtype: 'current_temp_type',
             getPos: 'select_model_id',
             getDragBoxs: 'getDragData',
             getModelType: 'getEditEnable',
             getAllDragBoxData: 'getAllDragData' 
          })
        },
        watch:{
           getDragBoxs:{
            handler(nv,ov){
              this.drags = nv;
              if(nv.length >= ov.length){
                this.initEvent();
              }
            },
            deep:true
           },

           getPos(nv,ov){
             this.setActiveClass(nv);
           },
           //更新坐标位置的改动
           showPosData:{
            handler(nv,ov){
             this.setXYWH(nv);
            },
            deep: true
           },
           getModelType(v1,v2){
            console.log(v1);
           }
        },
        mounted(){
          this.setSvgBoxData();
          this.resize();

          //初始化各类交互事件
          this.initEvent();

          var t = setTimeout(()=>{
            this.initActive();
            clearTimeout(t);
          },300)
        },
        updated(){
          this.setWrapperBoxInit();
        },
        created(){
          this.setSvgBoxData();
          this.initDragData();
          this.initDragBoxs();

          
        },
        components:{
          
        }
    }
</script>



<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"    
    
    .ib-wrapper
      wh(100%,100%);bgColor(#e5e5e5);ab(0,0);
      .ib-box
        wh(92%,92%);ab(4%,4%);bgColor(#ccc);box-sizing:border-box;
      .ib-svg-box-mask
        wh(100%,100%);ab(0,0);z-index:2;
      .ib-box-svg
        wh(100%,100%);ab(0,0);box-sizing:border-box;z-index:1;
        .ibs-item
          ab(0,0);border:2px solid #fff;text-align:center;color:#fff;box-sizing:border-box;font-size:16px;
          .ib-posText
            ab(50%,50%);transform:translate3d(-50%,-50%,0);
        .selectActive
          bgColor(#4696d1);
        
      .ibs-drag
        wh(auto,auto);border:1px solid red;ab(20px,20px);z-index:3;
        .ibsd-img
          wh(100%,100%);ab(0,0);
        .ibs-drag-zoom
          wh(3%,3%);abs();bottom:0;right:0;bgColor(red);cursor:nw-resize;
        .ibs-drag-close
          wh(12px,12px);abs();right:0;top:0;bgColor(red);cursor:pointer;color:#fff;font-size:10px;text-align:center;line-height:12px;text-indent:0px;
        .ibsd-text
          color:#fff;
      .ibs-drag-text
        cursor:pointer; font-size:16px;       
                        
</style>



