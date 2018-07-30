<template>
      
          
          <!-- 扇形动画 -->
          <div class="sbox-item sbox-item-3" data-type='3'>

             <!--  扇形展开 --> 
             <div class="sbox sbox-3">
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
                       <path d="" stroke="#000" class="motionPath—1"  id="rings-1"></path>
                       <path d="" stroke="#000" class="motionPath-2" id="rings-2"></path>
                      </defs>

                                            
                      <!-- 定义遮罩 -->
                      <clipPath id="3_SVGID_2_">
                       <use xlink:href="#rings-1"  style="overflow:visible;"/>
                       <use xlink:href="#rings-2"  style="overflow:visible;"/>
                      </clipPath>

                      <!-- 背景图片 -->
                      <image :xlink:href="imgSrc" x="0" y="0" height="100%" width="100%" preserveAspectRatio="xMidYMid slice"/>  
                      
                      <!-- 要绘制的扇形 -->
                      <g clip-path="url(#3_SVGID_2_)">
                        <image xlink:href="" x="-150" y="-100" width="600" height="400" preserveAspectRatio="xMaxYMax meet" class="cp-img" />
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
              id:'m3',
              title:'扇形效果',
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
            $('.sbox-item-3').click(function(){
              This.setMaskId(This.id);
              This.sectorfn($(this),$('#rings-1'),$('#rings-2'),$(this).find('.cp-img'));
            });
            
          },
          //1. 扇形动交互
          sectorfn(wrapper,elem1,elem2,img){

            var This = this,r = 250,cx = 150,cy = 100,degrees = 0,rad = 0,srad = 0;

            img.attr('xlink:href',this.cimg);
            elem1.get(0).setAttribute('transform', 'translate('+150+','+100+')');
            elem2.get(0).setAttribute('transform', 'translate('+150+','+100+')');
            wrapper.addClass('sbox-item-active');
            cancelAnimationFrame(This.timer);

            fn();
            function fn(){
              This.timer = requestAnimationFrame(fn);
              This.$emit('getTimer',This.timer);
              
              degrees+=1;

              rad = degrees * (Math.PI / 180);
              srad = (degrees) * (Math.PI / 180);
              if(degrees > 180){
                degrees = 0;
              }

              var x1 = (Math.sin(rad) * r).toFixed(2);
              var y1 = -(Math.cos(rad) * r).toFixed(2);

              var x2 = -(Math.sin(srad) * r).toFixed(2);
              var y2 = -(Math.cos(srad) * r).toFixed(2);

              var lenghty1 = window.Number(degrees > 180);
              var lenghty2 = window.Number(degrees < 180);

              var descriptions1 = [ 'M', 0, -r, 'A', r, r, 0, lenghty1, 1, x1, y1, 'L',0,0,'Z'];
              var descriptions2 = [ 'M', 0, -r, 'A', r, r, 0, 0, 0, x2, y2, 'L',0,0,'Z'];
              
              elem1.attr('d', descriptions1.join(' '));
              elem2.attr('d', descriptions2.join(' '));
            }

          },
          cancelStatus(){
            cancelAnimationFrame(this.timer);
            $('.sbox-item-3').removeClass('sbox-item-active');
            $('.sbox-item-3').find('.motionPath—1').attr('d','');
            $('.sbox-item-3').find('.motionPath-2').attr('d','');
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
