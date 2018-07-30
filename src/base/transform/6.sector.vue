<template>
      
          
          <!-- 扇形动画 -->
          <div class="sbox-item sbox-item-1" data-type='6'>

             <!--  扇形展开 --> 
             <div class="sbox sbox-1">
                <div class="sbox-svg">
                 <!-- 动效部分 -->
                  <div class="motion-box">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width='100%' height='100%' viewBox='0 0 300 200' class="svgBox">

                      <!-- 定义外部遮罩 -->
                      <clipPath id="clipPathDefinition" clipPathUnits="userSpaceOnUse" >
                       <rect x='0' y='0' width='300' height='200'/>
                      </clipPath>

                      <!-- 定义扇形运动路径 -->
                      <defs>
                       <path d="" stroke="#000" class="motionPath" transform="translate(150,100)" id="ring"></path>
                      </defs>

                      <!-- 定义遮罩 -->
                      <clipPath id="1_SVGID_2_">
                       <use xlink:href="#ring"  style="overflow:visible;"/>
                      </clipPath>

                      <!-- 背景图片 -->
                      <image :xlink:href="imgSrc" x="0" y="0" height="100%" width="100%" preserveAspectRatio="xMidYMid slice"/>  

                      <!-- 要绘制的扇形 -->
                      <g clip-path="url(#1_SVGID_2_)">
                        <image :xlink:href="cimg" x="-150" y="-100" width="600" height="400" preserveAspectRatio="xMaxYMax meet" class="cp-img" />
                      </g>

                    </svg>
                  </div><!-- //end motion-box -->
                </div><!-- //end sbox-svg -->
                <!-- 转场说明 -->  
                <div class="effect-intro">{{title}}</div> 
             </div><!-- //end sbox-1 -->
             
             
              
          </div>


</template>




<script scoped>
    
    import { mapGetters, mapMutations } from 'vuex';

    export default{
        data(){
            return{
              id:'m6',
              title:'时钟',
              timer: null
            }
        },
        props: {
          timers:{
            type: Object,
            default: null
          },
          cimg:{
            type: String,
            default: require('@/common/images/term_back_sel.png')
          },
          imgSrc:{
            type: String,
            default: require('@/common/images/term_back_sel1.png')
          }
        },
        methods:{
          initEvent(){
            var This = this;

            //1. 扇形交互动画
            $('.sbox-item-1').click(function(){

              //设置遮罩ID状态
              This.setMaskId(This.id);
              //console.log('motion 1');
              This.sectorfn($(this),$(this).find('.motionPath'),$(this).find('.cp-img'));
            });
            
          },
          //1. 扇形动交互
          sectorfn(wrapper,elem,img){
             var This = this,r = 250,cx = 150,cy = 100,degrees = 0,rad = 0;
             var box = elem.get(0);
             //img.attr('xlink:href',this.cimg);
             box.setAttribute('transform', 'translate('+150+','+100+')');
             wrapper.addClass('sbox-item-active');
             cancelAnimationFrame(This.timer);

              fn();
              function fn(){
                This.timer = requestAnimationFrame(fn);
                This.$emit('getTimer',This.timer);
                degrees+=1.5;
                rad = degrees * (Math.PI / 180);
                if(degrees > 360){
                  degrees = 0;
                }
                var x = (Math.sin(rad) * r).toFixed(2);
                var y = -(Math.cos(rad) * r).toFixed(2);
                var lenghty = window.Number(degrees > 180);
                var descriptions = [ 'M', 0, -r, 'A', r, r, 0, lenghty, 1, x, y, 'L',0,0,'Z'];
                elem.attr('d', descriptions.join(' '));
              }
          },
          cancelStatus(){
            cancelAnimationFrame(this.timer);
            $('.sbox-item-1').removeClass('sbox-item-active');
            $('.sbox-item-1').find('.motionPath').attr('d','');
          },
          ...mapMutations({
            setMaskId: 'maskid'
          })
        },
        computed:{
          ...mapGetters({
            getMaskId: 'maskid'
          })
        },
        watch:{
          getMaskId(nv,ov){
            if(nv !== this.id){
              this.cancelStatus();
            }
          }
        },
        mounted(){
          this.initEvent();
        }
    }
</script>
