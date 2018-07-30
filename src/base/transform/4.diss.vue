<template>
      
          
          <!-- 棋盘动画 -->
          <div class="sbox-item sbox-item-8" data-type='4'>

             <!--  棋盘展开 --> 
             <div class="sbox sbox-8">
                <div class="sbox-svg">

                  <!-- 动效部分 -->
                  <div class="motion-box">
                     <img :src="imgSrc" class="mbox-img">
                     <div class="diss-box" id="diss-box">
                        




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
              id: 'm4',
              title: '溶解',
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

            $('.sbox-item-8').click(function(){
              This.setMaskId(This.id);
              This.initDraw();
              This.sectorfn($(this),$(this).find('.cb-box'));
            });
          },

          initDraw(){
            
            var row = 8;
            var col = 7;
            var width = $('.diss-box').width();
            var height = $('.diss-box').height();
            var rw = Math.floor(width/6);
            var rh = Math.floor(height/col);
            var crw = Math.floor(width/row);
            var cstr = '';
            var rstr = '';
            var astr = '';
            var cindex = 0;

            for(var i=0;i<col;i++){
              var cstr = `<div class="cb-row-box" style="width:${rw*row}px;height:${rh}px;top:${rh*i}px;left:${ i%2==0 ? -parseInt(rw/2) : 0 }px;">`;
              rstr = '';
              for(var j=0;j<row;j++){
                cindex++;
                rstr += `<div class="cb-box" style="width:${rw}px;height:${rh}px;left:${rw*j}px; top:0px; opacity:0; background-image:url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1532844894449&di=2a046505cf28d75564baa61a9adc7d52&imgtype=0&src=http%3A%2F%2Fold.bz55.com%2Fuploads%2Fallimg%2F150422%2F139-1504221GZ3.jpg');background-size:${width*8/6}px ${height*8/6}px;background-position:${ i%2==0 ? -rw*j : -rw*j-parseInt(rw/2) }px ${-rh*i}px;" data-row="${i} data-index="${cindex}" ></div>`;
              }
              cstr = cstr + rstr + '</div>';
              astr += cstr;
            }

            $('#diss-box').html(astr);

          },
          //1. 交互
          sectorfn(wrapper,elem){

            var This = this,row = 8,col = 7,width = $('.chess-box').width(),rw = width/(row-2),w1 = 0,w2 = 0,count = 0,ci = 0,len = row*col,indexArr = [];
            
            //get 当前图片
            elem.each(function(index,ele){
              $(ele).css({
                'background-image': "url("+This.cimg+")",
                'opacity': 0,
                'transition': 'ease .5s'
              });
            });
            
            //打乱index数组数组顺序
            for(var i=0;i<=len;i++){
              indexArr.push(i);
            }
            indexArr.sort(function(a,b){
              return Math.random()-0.5;
            });

            //添加点击后样式
            wrapper.addClass('sbox-item-active');
            cancelAnimationFrame(This.timer);

            fn();
            function fn(){
              This.timer = requestAnimationFrame(fn);
              This.$emit('getTimer',This.timer);
              
              count+=0.5;

              if(count % 2 == 0){
                
                elem.eq(indexArr[ci]).css('opacity',1);
                elem.eq(indexArr[ci+1]).css('opacity',1);

                ci+=2;
              }

              if(ci > indexArr.length+3){
                ci = 0;
                for(var i=0;i<indexArr.length;i++){
                  elem.eq(i).css('opacity',0);
                }
                //cancelAnimationFrame(This.timer);
                //return;
              }
            }
          },
          cancelStatus(){
            cancelAnimationFrame(this.timer);
            $('.sbox-item-8').removeClass('sbox-item-active');
            $('.sbox-item-8').find('.cb-box').each(function(index,ele){
              $(ele).css('opacity',0);
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
