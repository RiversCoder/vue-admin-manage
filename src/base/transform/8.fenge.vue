<template>
      
          
          <!-- 分割动画 -->
          <div class="sbox-item sbox-item-5" data-type='8'>

             <!--  分割展开 --> 
             <div class="sbox sbox-5">
                <div class="sbox-svg">
                 <!-- 动效部分 -->
                  <!-- 动效部分 -->
                  <div class="motion-box">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width='100%' height='100%' viewBox='0 0 300 200' class="svgBox">
   
                      <!-- 定义外部遮罩 -->
                      <clipPath id="clipPathDefinition" clipPathUnits="userSpaceOnUse" >
                       <rect x='0' y='0' width='300' height='200'/>
                      </clipPath>
                      
                      <!-- 定义扇形运动路径 -->
                      <defs>
                       <rect x='0' y='0' width='300' height='200' id="rects-5-1"/>
                      </defs>
                      
                      <!-- 定义遮罩 -->
                      <clipPath id="5_SVGID_2_">
                       <use xlink:href="#rects-5-1"  style="overflow:visible;"/>
                      </clipPath>

                      <!-- 背景图片 -->
                      <image :xlink:href="cimg" x="0" y="0" height="100%" width="100%" preserveAspectRatio="xMidYMid slice"/>  
                      
                      <!-- 要绘制的扇形 -->
                      <g clip-path="url(#5_SVGID_2_)">
                        <image :xlink:href="imgSrc" x="0" y="0" width="300" height="200" preserveAspectRatio="xMidYMid slice" class="cp-img" />
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
              id: 'm8',
              title: '分割',
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
            $('.sbox-item-5').click(function(){
              This.setMaskId(This.id);
              This.sectorfn($(this),$('#rects-5-1'),$(this).find('.cp-img'));
            });
            
          },
          //分割动画
          sectorfn(wrapper,elem1,img){

            var This = this,w = 300,x = 0,width = 300;

            //img.attr('xlink:href',this.cimg);
            // elem1.get(0).setAttribute('transform', 'translate('+150+','+100+')');
            // elem2.get(0).setAttribute('transform', 'translate('+150+','+100+')');
            wrapper.addClass('sbox-item-active');
            cancelAnimationFrame(This.timer);

            fn();
            function fn(){
              This.timer = requestAnimationFrame(fn);
              This.$emit('getTimer',This.timer);
              
              w-=1.5;
              x = (width-w)/2;

              if(w <= 0){
                w = 300;
                x = 0;
              }
              
              if(w > 0){
                elem1.attr({x:x,'width':w});
              } 
            }
          },
          cancelStatus(){
            cancelAnimationFrame(this.timer);
            $('.sbox-item-5').removeClass('sbox-item-active');
            $('.sbox-item-5').find('#rects-5-1').attr({'width':'100%','x':0});
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
