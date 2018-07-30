<template>
      
          
          <!-- 棋盘动画 -->
          <div class="sbox-item sbox-item-7" data-type="7">

             <!--  棋盘展开 --> 
             <div class="sbox sbox-7">
                <div class="sbox-svg">

                  <!-- 动效部分 -->
                  <div class="motion-box">
                     <img :src="imgSrc" class="mbox-img">
                     <div class="chess-box" id="chess-box">
                       
                     </div>
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
              id:'m7',
              title: '棋盘',
              timer: null,
              tiimg:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1532844894449&di=2a046505cf28d75564baa61a9adc7d52&imgtype=0&src=http%3A%2F%2Fold.bz55.com%2Fuploads%2Fallimg%2F150422%2F139-1504221GZ3.jpg'
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

            $('.sbox-item-7').click(function(){
              This.setMaskId(This.id);
              This.initDraw();
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
                rstr += `<div class="cb-box" style="width:${rw}px;height:${rh}px;left:${rw*j}px;top:0px; background-image:url('${this.cimg}');background-size:${width*8/6}px ${height*8/6}px;background-position:${ i%2==0 ? -rw*j : -rw*j-parseInt(rw/2) }px ${-rh*i}px;" data-row="${i} "></div>`;
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
                'background-image': "url("+This.cimg+")"
              });
            });
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
                count = 0;
                w2 = 0;
                w1 = 0;
                //cancelAnimationFrame(This.timer);
                //return;
              } 
            }
          },
          cancelStatus(){
            cancelAnimationFrame(this.timer);
            $('.sbox-item-7').removeClass('sbox-item-active');
            $('.sbox-item-7').find('.cb-box').each(function(index,ele){
              $(ele).css('width',0);
            });
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
