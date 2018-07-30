<template>
      
          
          <!-- 扇形动画 -->
          <div class="sbox-item sbox-item-0" data-type="0" >

             <!--  扇形展开 --> 
             <div class="sbox sbox-0">
                <div class="sbox-svg">
                 <!-- 动效部分 -->
                   <div class="motion-box">
                      
                      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width='100%' height='100%' viewBox='0 0 300 200' class="svgBox">

                      <!-- 背景图片 -->
                      <image :xlink:href="imgSrc" x="0" y="0" height="100%" width="100%" preserveAspectRatio="xMidYMid slice"/>  

                    </svg>

                   </div>>
                 </div>
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
              id:'m0',
              title:'无',
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
            $('.sbox-item-0').click(function(){
              //设置遮罩ID状态
              This.setMaskId(This.id);
              $(this).addClass('sbox-item-active');
            });
            
          },
          cancelStatus(){
            $('.sbox-item-0').removeClass('sbox-item-active');
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
