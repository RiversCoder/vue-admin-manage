<template>
      
      <!-- svg-transform-wrapper -->
      <div class="svg-transform-wrapper">

          <!-- 时钟动画 -->
          <clockMotion @getTimer="getTimer"></clockMotion>
          
          <!-- 百叶窗动画 -->
          <Windows @getTimer="getTimer"></Windows>
          
          <!-- 扇形动画 -->
          <SX @getTimer="getTimer"></SX >
          
          <!-- 十字扩展动画 -->
          <SZ @getTimer="getTimer"></SZ>

          <!-- 分割动画 -->
          <Fenge @getTimer="getTimer"></Fenge>

          <!-- 覆盖动画 -->
          <Cover @getTimer="getTimer"></Cover>
          
          <!-- 棋盘动画 -->
          <Chess @getTimer="getTimer"></Chess>
          
      </div>

</template>




<script scoped>
    
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
    import pc from 'common/js/pc.js'
    import './transform.styl'

    //1.时钟动画
    import clockMotion from './1.sector.vue'
    //2. 百叶窗动画
    import Windows from './2.windows.vue'
    //3. 扇形动画
    import SX from './3.sx.vue'
    //4. 十字动画
    import SZ from './4.shizi.vue'
    //5. 分割动画
    import Fenge from './5.fenge.vue'
    //6. 覆盖动画
    import Cover from './6.cover.vue'
    //7. 棋盘动画
    import Chess from './7.chess.vue'

    export default{
        data(){
            return{
              ctimer: 0
            }
        },
        props: {
          
        },
        methods:{
          getTimer(timer){
            cancelAnimationFrame(this.ctimer);
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
          Chess
        }
    }
</script>
