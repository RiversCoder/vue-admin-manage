<template>
      
      <!-- svg-transform-wrapper -->
      <div class="svg-transform-wrapper">
          
          <!-- 无动画 -->
          <Wu @getTimer="getTimer" :cimg="currentImg" :imgSrc="imgSrc"></Wu>

          <!-- 十字扩展动画 -->
          <SZ @getTimer="getTimer" :cimg="currentImg" :imgSrc="imgSrc"></SZ>

          <!-- 百叶窗动画 -->
          <Windows @getTimer="getTimer" :cimg="currentImg" :imgSrc="imgSrc"></Windows>

           <!-- 扇形动画 -->
          <SX @getTimer="getTimer" :cimg="currentImg" :imgSrc="imgSrc"></SX >
         
          <!-- 溶解动画 -->
          <Diss @getTimer="getTimer" :cimg="currentImg" :imgSrc="imgSrc"></Diss>

          <!-- 覆盖动画 -->
          <Cover @getTimer="getTimer" :cimg="currentImg" :imgSrc="imgSrc"></Cover>
          
          <!-- 时钟动画 -->
          <clockMotion @getTimer="getTimer" :cimg="currentImg" :imgSrc="imgSrc"></clockMotion>

          <!-- 棋盘动画 -->
          <Chess @getTimer="getTimer" :cimg="currentImg" :imgSrc="imgSrc"></Chess>

          <!-- 分割动画 -->
          <Fenge @getTimer="getTimer" :cimg="currentImg" :imgSrc="imgSrc"></Fenge>

      </div>

</template>


<script scoped>
    
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
    import pc from 'common/js/pc.js'
    import './transform.styl'


    //0.无动画
    import Wu from './0.none.vue'
    //1.时钟动画
    import clockMotion from './6.sector.vue'
    //2. 百叶窗动画
    import Windows from './2.windows.vue'
    //3. 扇形动画
    import SX from './3.sx.vue'
    //4. 十字动画
    import SZ from './1.shizi.vue'
    //5. 分割动画
    import Fenge from './8.fenge.vue'
    //6. 覆盖动画
    import Cover from './5.cover.vue'
    //7. 棋盘动画
    import Chess from './7.chess.vue'
    //8. 溶解动画
    import Diss from './4.diss.vue'

    export default{
        data(){
            return{
              ctimer: 0,
              cimg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1532931195116&di=62288d70129e06ece429a33d8432e0cc&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20150907%2Fmp30906533_1441629699374_2.jpeg',
              imgSrc: require('@/common/images/term_back_sel1.png')
            }
        },
        props:{
          currentImg: {
            type: String,
            default: this.cimg
          }
        },
        methods:{
          getTimer(timer){
            //cancelAnimationFrame(this.ctimer);
            this.ctimer = timer;
          }
        },
        computed:{
          
        },
        mounted(){
          
        },
        components:{
          clockMotion,
          Windows,
          SX,
          SZ,
          Fenge,
          Cover,
          Chess,
          Diss,
          Wu
        }
    }
</script>
