<template>
      
          
          <!-- 覆盖动画 -->
          <div class="sbox-item sbox-item-6" data-type="5">

             <!--  覆盖展开 --> 
             <div class="sbox sbox-6">
                <div class="sbox-svg">

                  <!-- 动效部分 -->
                  <div class="motion-box">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width='100%' height='100%' viewBox='0 0 300 200' class="svgBox">
                      
                      <!-- 定义扇形运动路径 -->
                      <defs>
                       <rect x='0' y='0' width='300' height='200' id="rects-6-1"/>
                      </defs>
                      
                      <!-- 定义遮罩 -->
                      <clipPath id="6_SVGID_2_">
                       <use xlink:href="#rects-6-1"  style="overflow:visible;"/>
                      </clipPath>

                      <!-- 背景图片 -->
                      <image :xlink:href="imgSrc" x="0" y="0" height="100%" width="100%" preserveAspectRatio="xMidYMid slice"/>  
                      
                      <!-- 要绘制的扇形 -->
                      <g clip-path="url(#6_SVGID_2_)" >
                        <image :xlink:href="cimg" x="300" y="0" width="300" height="200" preserveAspectRatio="xMaxYMax slice" class="cp-img" />
                      </g>
                     </svg>
                  </div><!-- //end motion-box -->
                </div><!-- //end sbox-svg -->
             </div><!-- //end sbox-1 -->
           
            <!-- 转场说明 -->  
            <div class="effect-intro">{{title}}</div>       
          </div>


</template>




<script scoped>
    
    import { mapGetters, mapMutations } from 'vuex';

    export default{
        data(){
            return{
              id:'m5',
              title:'覆盖',
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

            $('.sbox-item-6').click(function(){
              This.setMaskId(This.id);
              This.sectorfn($(this),$(this).find('.cp-img'));
            });
            
          },
          //1. 扇形动交互
          sectorfn(wrapper,img){

            var This = this,w = 300,x = 300,width = 300;

            //img.attr('xlink:href',this.cimg);
            // elem1.get(0).setAttribute('transform', 'translate('+150+','+100+')');
            // elem2.get(0).setAttribute('transform', 'translate('+150+','+100+')');
            wrapper.addClass('sbox-item-active');
            cancelAnimationFrame(This.timer);

            fn();
            function fn(){
              This.timer = requestAnimationFrame(fn);
              This.$emit('getTimer',This.timer);
              
              x -= 1.5;

              if(x <= 0){
                x = 300;
              }
              
              if(x > 0){
                img.attr({x:x});
              } 
            }
          },
          cancelStatus(){
            cancelAnimationFrame(this.timer);
            $('.sbox-item-6').removeClass('sbox-item-active');
            $('.sbox-item-6').find('.cp-img').attr('x',300);
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
