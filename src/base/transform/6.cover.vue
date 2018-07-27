<template>
      
          
          <!-- 覆盖动画 -->
          <div class="sbox-item sbox-item-6">

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
                      <image xlink:href="http://img05.tooopen.com/images/20150521/tooopen_sy_125610923736.jpg" x="0" y="0" height="100%" width="100%" preserveAspectRatio="xMidYMid slice"/>  
                      
                      <!-- 要绘制的扇形 -->
                      <g clip-path="url(#6_SVGID_2_)" >
                        <image :xlink:href="imgSrc" x="300" y="0" width="300" height="200" preserveAspectRatio="xMaxYMax slice" class="cp-img" />
                      </g>
                     </svg>
                  </div><!-- //end motion-box -->
                </div><!-- //end sbox-svg -->
             </div><!-- //end sbox-1 -->
               
          </div>


</template>




<script scoped>

    export default{
        data(){
            return{
              imgSrc: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1532604386990&di=614d672cf7c656d938dd4a37f141a362&imgtype=jpg&src=http%3A%2F%2Fimg4.imgtn.bdimg.com%2Fit%2Fu%3D2275076119%2C299053444%26fm%3D214%26gp%3D0.jpg',
              cimg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1532627805987&di=e59ac1eb42e3d050c81cdf77465eda6d&imgtype=0&src=http%3A%2F%2Fpic35.photophoto.cn%2F20150629%2F0036036319421772_b.jpg',
              timer: null
            }
        },
        props: {
          timers:{
            type: Object,
            default: null
          }
        },
        methods:{
          initEvent(){
            var This = this;

            $('.sbox-item-6').click(function(){
              This.sectorfn($(this),$(this).find('.cp-img'));
            });
            
          },
          //1. 扇形动交互
          sectorfn(wrapper,img){

            var This = this,w = 300,x = 300,width = 300;

            img.attr('xlink:href',this.cimg);
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

          }
        },
        computed:{
          
        },
        mounted(){
          this.initEvent();
        }
    }
</script>
