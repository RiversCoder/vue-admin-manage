<template>
      
          
          <!-- 棋盘动画 -->
          <div class="sbox-item sbox-item-8">

             <!--  棋盘展开 --> 
             <div class="sbox sbox-8">
                <div class="sbox-svg">

                  <!-- 动效部分 -->
                  <div class="motion-box">
                     <img :src="cimg" class="mbox-img">
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
              timer: null,
              tiimg:'http://hiphotos.baidu.com/image/w=730;crop=0,0,730,405/sign=b7582befd9a20cf44690fcdc46322844/cf1b9d16fdfaaf511d042dd7855494eef11f7af7.jpg'
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

              This.sectorfn($(this),$(this).find('.cb-box'));
            });
            
          },
          initDraw(){
            
            var row = 8;
            var col = 5;
            var width = $('.chess-box').width();
            var height = $('.chess-box').height();
            var rw = Math.floor(width/6);
            var rh = Math.floor(height/col);
            var crw = Math.floor(width/row);
            var cstr = '';
            var rstr = '';
            var astr = '';

            for(var i=0;i<col;i++){
              var cstr = `<div class="cb-row-box" style="width:${rw*row}px;height:${rh}px;top:${rh*i}px;left:${ i%2==0 ? -parseInt(rw/2) : 0 }px;">`;
              rstr = '';
              for(var j=0;j<row;j++){
                rstr += `<div class="cb-box" style="width:${rw}px;height:${rh}px;left:${rw*j}px;top:0px; background-image:url('http://hiphotos.baidu.com/image/w=730;crop=0,0,730,405/sign=8630d99f963df8dca63d8d92fd2a11f9/0824ab18972bd407c305049572899e510eb3099c.jpg');background-size:${width*8/6}px ${height*8/6}px;background-position:${ i%2==0 ? -rw*j : -rw*j-parseInt(rw/2) }px ${-rh*i}px;" data-row="${i} "></div>`;
              }
              cstr = cstr + rstr + '</div>';
              astr += cstr;
            }

            $('#chess-box').html(astr);

          },
          //1. 交互
          sectorfn(wrapper,elem){

            var This = this,row = 8,col = 5,width = $('.chess-box').width(),rw = width/(row-2),w1 = 0,w2 = 0,count = 0;
            elem.each(function(index,ele){
              $(ele).css({
                'width': 0,
                'background-image': "url("+This.tiimg+")"
              });
            });
            //img.attr('xlink:href',this.cimg);
            // elem1.get(0).setAttribute('transform', 'translate('+150+','+100+')');
            // elem2.get(0).setAttribute('transform', 'translate('+150+','+100+')');
            wrapper.addClass('sbox-item-active');
            cancelAnimationFrame(This.timer);

            fn();
            function fn(){
              This.timer = requestAnimationFrame(fn);
              This.$emit('getTimer',This.timer);
              count+=0.5;
              if(count > 20){
                w2+=0.6;
              }
              w1+=0.6;
              
              elem.each(function(index,ele){
                if(ele.dataset.row % 2 == 0){
                   $(ele).css({
                     'width': w1
                   });
                }else{
                  $(ele).css({
                     'width': w2
                   });
                }  

              });

              if(w1 > rw){
                w1 = rw;
              }

              if(w2 > rw){
                w2 = rw;
                cancelAnimationFrame(This.timer);
                return;
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
