<template>
    <div class="interactive-select" >
       <section class="pe-selector">
          
          <div class="pe-container">
              <div class="pe-ctab">
                  <div class="pe-ctab-title">
                      <span class="pct-item" :data-type='item.type' v-for="item,index in titles" @click="openSelectBox(item.type)"></span>
                  </div>
                  <div class="pe-ctab-content">
                        
                        <!-- <el-scrollbar style="height:100%"> -->
                        <div v-if=" renderData.length>0 && (renderData[0].type == 'clock' || renderData[0].type == 'weather' ) " >
                            <ul class="pcc-lists">
                              <li class="pcc-item" v-for="item,index in renderData" @click="setDragBox(item)">
                                <img :src="require('@/common/images/'+item.src)" alt="" class="pcc-item-img" />
                              </li>
                            </ul>
                        </div>
                        
                        <!--  </el-scrollbar> -->
                        <div class="positionSizeTextBox" v-if=" currentType === 'text' ">
                            <div  class="positionSize">
                                <div class="ic-box pos-box">
                                    <h3 class="icon-b-title">位置</h3>
                                    <span class="icon-b icon-title">x</span> <span class="icon-point">:</span> <span class="icon-b icon-content">{{showPosData.x}}</span>
                                    <span class="icon-b icon-title">y</span> <span class="icon-point">:</span> <span class="icon-b icon-content">{{showPosData.y}}</span>
                                </div>
                                <div class="ic-box size-box">
                                    <h3 class="icon-b-title">大小</h3>
                                    <span class="icon-b icon-title">w</span> <span class="icon-point">:</span> <span class="icon-b icon-content">{{showPosData.w}}</span>
                                    <span class="icon-b icon-title">h</span> <span class="icon-point">:</span> <span class="icon-b icon-content">{{showPosData.h}}</span>
                                </div>
                            </div>
                            <div class="addText">
                                <h3 class="addTextTitle">添加文本</h3>
                                <textarea class="addTextBox" v-model="textareaTxt"></textarea>
                            </div>
                        </div>

                        
                        <!-- 模块选择 -->    
                        <div class="selectModels" v-if=" currentType === 'model'">
                                                 
                            <ul class="sm-lists">
                                <li class="sm-item" v-for="item,index in currentRects" :data-mid="item.mid">
                                    <span class="sm-item-pos">位置 {{index+1}}</span>
                                    <span class="sm-item-size">推荐尺寸 {{item.size}}</span>
                                    <i class="el-icon-check" v-if=" item.files.length > 0 "></i>
                                </li>
                            </ul>
                        
                        </div>    

                    </div> 

                    <div class="pe-ctab-btn">
                        <el-button plain v-if="sureBtnState" @click.native="toggleSelectBox" class="toggleSureBtn">确定</el-button>
                        <el-button plain v-if=" currentType === 'model'" @click.native="addSource" class="addSource">添加素材</el-button>  
                    </div>  
              </div>
          </div>
          
          <!-- 确定按钮 -->  
          <!-- <el-button plain v-if="sureBtnState" @click.native="toggleSelectBox" class="toggleSureBtn">确定</el-button>
          <el-button plain v-if=" currentType === 'model'" @click.native="addSource" class="addSource">添加素材</el-button>   -->

       </section>
    </div>
</template>



<script scoped>

    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
    import pc from 'common/js/pc.js';

    export default {
        data(){
           return{
             sureBtnState: false,
             textareaTxt: '',
             currentType: '',
             currentModelId: '',
             titles: [{ type:'weather' },{ type:'clock' },{ type:'text' },{ type:'model' }],
             imgs: [{src:'https://uploadfile.huiyi8.com/2014/0714/20140714111156467.jpg'},{src:'https://uploadfile.huiyi8.com/2014/0714/20140714111202491.jpg'},{src:'https://uploadfile.huiyi8.com/2014/0714/20140714111407193.jpg'},{src:'https://uploadfile.huiyi8.com/2014/0714/20140714111359894.jpg'},{src:'https://uploadfile.huiyi8.com/2014/0714/20140714111432916.jpg'},{src:'https://uploadfile.huiyi8.com/2014/0714/20140714111439411.jpg'}],
            datas:[{
                src: 'weather/weather/weather1@3x.png',
                type:'weather',
                style: 0
            },{
                src: 'weather/weather/weather2@3x.png',
                type:'weather',
                style: 1
            },{
                src: 'weather/weather/weather3@3x.png',
                type:'weather',
                style: 2
            },{
                src: 'weather/clock/clock1@3x.png',
                type:'clock',
                style: 0
            },{
                src: 'weather/clock/clock2@3x.png',
                type:'clock',
                style: 1
            },{
                src: 'weather/clock/clock3@3x.png',
                type:'clock',
                style: 2
            },{
                src: 'weather/clock/clock4@3x.png',
                type:'clock',
                style: 3
            },{
                src: 'weather/clock/clock5@3x.png',
                type:'clock',
                style: 4
            },{
                src: 'weather/clock/clock6@3x.png',
                type:'clock',
                style: 5
            }],
            renderData:[],
            currentRects: [],
            showPosData: {x: 0,y: 0,w: 0,h: 0} 
           }
        },
        methods:{
            initModel(){

                if(this.$route.query.stype && this.$route.query.mid){
                    this.currentType = 'model';
                    this.currentModelId = this.$route.query.mid;

                    this.setModelId(this.currentModelId);
                    this.setActiveClass(this.currentModelId);
                    this.openSelectBox(this.currentType);
                }else{
                    this.setModelId(-1);
                }

            },
            getCurrentRects(){
                //1. 
                this.currentRects = pc.getCurrentRects(this.getCid,this.getTimeLists);

                //2. 获取当前的currentType
                if(this.$route.query.stype){
                    this.currentType = this.$route.query.stype;

                }
            },
            getDataByType(type){
                for(var i=0;i<this.datas.length;i++){
                    if(this.datas[i].type == type){
                        this.renderData.push(this.datas[i]);
                    }
                }
            },
            initWH(){
                var This = this;

                function fn(){
                    var h = $('.pe-ctab').height();
                    $('.pcc-lists').width(This.renderData.length*h);
                    $('.pcc-lists').height(h);


                    $('.pcc-item').width(h);
                    $('.pcc-item').height(h);
                }   

                fn();
                window.addEventListener('resize',fn);
            },
            //打开选择资源盒子
            openSelectBox(type){

                this.setEditEnable(type);
                
                this.currentType = type;
                this.renderData = [];
                this.sureBtnState = true;
                //$('.pe-ctab').get(0).removeEventListener('transitionend',this.closeBox,false);
                this.getDataByType(type);
                $('.pe-ctab').css('transform','translate3d(0,-100%,0)');
                
            },
            //关闭选择资源盒子
            toggleSelectBox(){
                //$('.pe-ctab').get(0).addEventListener('transitionend',this.closeBox,false);
                $('.pe-ctab').css('transform','translate3d(0,0,0)');
                
                //判断是否为文本插件
                if(this.currentType == 'text'){
                    //在编辑框内添加文本
                    this.addTextBox();
                }
                
            },
            closeBox(){
                this.currentType = '';
                this.renderData = [];
                this.sureBtnState = false;
            },
            //点击添加资源按钮
            addSource(){
                //跳转到选择资源界面
                
                //1.检测是否已经选择位置
                console.log(this.getModelId);
                if(this.getModelId == -1){
                    this.$message({
                      message: '请选择模板位置！',
                      type: 'warning',
                      showClose: true
                    });
                    return;
                }

                //2. 跳转到选择素材页面
                this.$router.push({ path: '/pc/select', query:{ direct: '' } });
            },
            //点击图片
            setDragBox(elem){
                
                var obj = {};
                var arr = [];

                obj['ctype'] = elem.type;
                obj['type'] = 'img';
                obj['content'] = require('common/images/'+elem.src);
                obj['style'] = elem.style;
                obj['oid'] = pc.randomString(12);

                //console.log(this.getDragBoxs);
                //1. 首先当前获取
                this.getDragBoxs.push(obj);
                //2. 再在当前基础上添加
                this.setDragBoxs(this.getDragBoxs);
            },
            //添加文字框
            addTextBox(){
                //console.log(this.textareaTxt)
                
                if(!this.textareaTxt) return;

                var obj = {};
                var arr = [];

                obj['ctype'] = 'text';
                obj['type'] = 'text';
                obj['content'] = this.textareaTxt;
                obj['oid'] = pc.randomString(12); 

                this.getDragBoxs.push(obj);
                this.setDragBoxs(this.getDragBoxs);
                this.textareaTxt = '';
               // console.log(this.dragBoxs);
               
            },
            //初始化位置列表点击事件
            initPosToggle(){
                var oldOne = null;
                var This = this;
                $('.sm-item').click(function(e){
                    //if(oldOne) oldOne.removeClass('sm-item-active');

                    //1. 给当前添加样式
                    //$(this).addClass('sm-item-active');
                    //2. 改变model状态
                    
                    This.setModelId(this.dataset.mid);
                    oldOne = $(this);
                })
            },
            setActiveClass(mid){
                $('.sm-item').each(function(index,elem){
                    $(elem).removeClass('sm-item-active');
                    
                    if(elem.dataset.mid == mid){
                        $(this).addClass('sm-item-active');
                    }
                })
            },

            //动态计算宽高
            countXYWH(pos){
                var bw = 1600;
                var bh = 900;

                this.showPosData = { x: parseInt(bw*pos.x) ,y: parseInt(bh*pos.y), w: parseInt(bw*pos.w), h: parseInt(bh*pos.h)  };
            },
            ...mapMutations({
                setDragBoxs: 'dragBoxs',
                setModelId: 'select_model_id',
                setEditEnable: 'editEnable'
            })
        },
        computed:{
            ...mapGetters({
                getTimeLists:'timeList',
                getCid: 'timelist_cid',
                getDragBoxs: 'getDragData',
                getModelId: 'select_model_id',
                getPosData: 'getPosWidth'
            })
        },
        watch:{
            getModelId: {
                handler(nv,ov){
                   this.setActiveClass(nv);
                },
                deep:true
            },
            getPosData: {
                handler(nv,ov){
                   this.countXYWH(nv);
                },
                deep:true
            },
            getTimeLists:{
                handler(nv,ov){
                   this.getCurrentRects();
                },
                deep:true
            }  
        },
        created(){
           this.getCurrentRects();
        },
        updated(){
           this.initWH();

           if(this.currentType == 'model'){
             this.initPosToggle();
           }

        },
        mounted(){
          
          this.initWH();
          this.setModelId(-1);

          var t = setTimeout(()=>{
            this.initModel();
            clearTimeout(t);
          },500)

        },
        components:{
           
        }
    }
    
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
    .interactive-select
      wh(100%,100%);/*bgColor(#333);*/ab(0,0);
      .pe-selector
        wh(100%,100%);@extend .rp;
        .toggleSureBtn
            abs();right:20px;bottom:10px;
        .addSource
            abs();right:95px;bottom:10px;    
        .pe-container
            wh(100%,100%);ab(0,0);bgColor(#fafafa);overflow:hidden;
            .pe-ctab
                wh(100%,100%);ab(0,0);transform:translate3d(0,0,0);transition:.8s ease;
            .pe-ctab-title
                wh(60%,100%);display:flex;margin:0 auto;
                .pct-item
                    wh(25%,100%);box-sizing:border-box;background-repeat:no-repeat;background-position:center center;cursor:pointer;
                    &:nth-of-type(1)
                        bgImg('~common/images/weather/m1.png');background-size:65% 65%;
                    &:nth-of-type(2)
                        bgImg('~common/images/weather/m2.png');background-size:65% 65%;
                    &:nth-of-type(3)
                        bgImg('~common/images/weather/m3.png');background-size:65% 65%;
                    &:nth-of-type(4)
                        bgImg('~common/images/weather/m4.png');background-size:65% 65%;
                    &:hover
                        opacity:.8;
            .pe-ctab-btn
                wh(20%,100%);float:left;@extend .rp;
                            
            .pe-ctab-content
                wh(80%,100%);box-sizing:border-box;padding-left:2%;overflow-x:auto; overflow-y:hidden;@extend .rp;float:left;/*overflow-x:auto;overflow-y:hidden;*/
                .pcc-lists
                  wh(auto,100%);display:flex;
                  .pcc-item
                    wh(auto,100%);cursor:pointer;@extend .rp;bgColor(#333);margin-left:10px;background-repeat:no-repeat;background-position:center center;background-size:38%;
                    .pcc-item-img
                      wh(40%,auto);ab(50%,50%);transform:translate3d(-50%,-50%,0);
            
            .positionSizeTextBox
                wh(100%,100%);@extend .rp;
            .positionSize
                display:block;wh(48%,80%);margin-top:20px;@extend .rp;box-sizing:border-box;padding-top:2%;
                .ic-box
                    wh(100%,60px);hh(60px);@extend .rp;
                    &:nth-of-type(1)
                        margin-top:2%;
                    &:nth-of-type(2)
                        margin-top:6%;    
                    .icon-b-title
                        ab(0,-10px);hh(22px);font-size:18px;
                    
                .icon-b
                    border:1px solid #333;text-align:center;border-radius:3px; 
                .icon-title
                    padding:3px 10px;font-size:16px;        
                .icon-content
                    display:inline-block;width:60px;height:26px;line-height:26px;@extend .rp;padding:0 5px;font-size:16px;
                .icon-point
                    font-size:16px;     
                      
            .addText
                wh(36%,80%);abs();right:5%;top:-5%;box-sizing:border-box;padding-top:2%;
                .addTextTitle
                    line-height:26px; font-size:18px;              
                .addTextBox
                    wh(100%,73%);border-radius:8px;margin-top: 5px;
            .selectModels
                wh(100%,100%);@extend .rp;
                .sm-lists
                    wh(100%,100%);@extend .rp;
                    .sm-item
                        wh(100%,20%);@extend .rp;font-size:14px;cursor:pointer;
                        
                        .sm-item-pos
                            color:#898989;hh(100%);text-indent:20px;ab(0,30%);
                        .sm-item-size
                            color:#898989;abs();right:10%;top:30%;
                        .el-icon-check
                            color:#4696d1;abs();right:2%;top:30%;    
                    .sm-item-active
                        bgColor(#d9d9d9);        
                            
                        
                        
                    
                                         
</style>