<template>
      
          
          <!-- 十字动画 -->
          <div class="sbox-item sbox-item-4">

             <!--  十字展开 --> 
             <div class="sbox sbox-4">
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
                       <rect x='0' y='0' width='300' height='200' id="rects-1"/>
                       <rect x='0' y='0' width='300' height='200' id="rects-2"/>
                      </defs>
                      
                      <!-- 定义遮罩 -->
                      <clipPath id="4_SVGID_2_">
                       <use xlink:href="#rects-1"  style="overflow:visible;"/>
                       <use xlink:href="#rects-2"  style="overflow:visible;"/>
                      </clipPath>

                      <!-- 背景图片 -->
                      <image xlink:href="http://img05.tooopen.com/images/20150521/tooopen_sy_125610923736.jpg" x="0" y="0" height="100%" width="100%" preserveAspectRatio="xMidYMid slice"/>  
                      
                      <!-- 要绘制的扇形 -->
                      <g clip-path="url(#4_SVGID_2_)">
                        <image xlink:href="" x="0" y="0" width="300" height="200" preserveAspectRatio="xMaxYMax slice" class="cp-img" />
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

            //1. 扇形交互动画
            $('.sbox-item-4').click(function(){
              This.sectorfn($(this),$('#rects-1'),$('#rects-2'),$(this).find('.cp-img'));
            });
            
          },
          //1. 扇形动交互
          sectorfn(wrapper,elem1,elem2,img){

            var This = this,w = 300,h = 200,x = 0,y = 0,width = 300,height = 200;

            img.attr('xlink:href',this.cimg);
            // elem1.get(0).setAttribute('transform', 'translate('+150+','+100+')');
            // elem2.get(0).setAttribute('transform', 'translate('+150+','+100+')');
            wrapper.addClass('sbox-item-active');
            cancelAnimationFrame(This.timer);

            fn();
            function fn(){
              This.timer = requestAnimationFrame(fn);
              This.$emit('getTimer',This.timer);
              
              w--;
              x = (width-w)/2;
              h-=0.66;
              y = (height-h)/2;

              if(w <= 0){
                w = 300;
                h = 200
                x = 0;
                y = 0;
              }
              
              if(w > 0){
                elem1.attr({x:x,'width':w});
              }

              if(h > 0 ){
                elem2.attr({y:y,'height':h});
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
