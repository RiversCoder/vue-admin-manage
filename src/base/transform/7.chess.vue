<template>
      
          
          <!-- 棋盘动画 -->
          <div class="sbox-item sbox-item-6">

             <!--  棋盘展开 --> 
             <div class="sbox sbox-6">
                <div class="sbox-svg">

                  <!-- 动效部分 -->
                  <div class="motion-box">
                     <div class="chess-box" id="chess-box">
                       
                     </div>
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

            $('.sbox-item-7').click(function(){
              This.sectorfn($(this),$(this).find('.cp-img'));
            });
            
          },
          initDraw(){
            
            var row = 8;
            var col = 5;
            var width = 300;
            var height = 200;
            var rw = Math.floor(width/(row-2));
            var rh = Math.floor(height/col);
            var cstr = '';
            var rstr = '';
            var astr = '';

            for(var i=0;i<col;i++){
              var cstr = `<div class="cb-row-box" style="width:100%;height:${rh}px;top:${rh*i}px;left:${ i%2==0 ? -parseInt(rw/2) : 0 }px;">`;
              rstr = '';
              for(var j=0;j<row;j++){
                rstr += `<div class="cb-box" style="width:${rw}px;height:${rh}px;"></div>`;
              }
              cstr = cstr + rstr + '</div>';
              astr += cstr;
            }

            console.log(astr);

            $('#chess-box').html(astr);

          },
          //1. 交互
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
          this.initDraw();
          this.initEvent();
        }
    }
</script>
