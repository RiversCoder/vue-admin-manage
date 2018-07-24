<template>
    <div class="program-controls" >

        <div class="pcc-title-content">
            <div class="panel-title-box">
                 <span class="ptb-line"></span>
                 <span class="ptb-title">{{titles[0]}}</span>
            </div>
            <div class="panel-title-box">
                 <span class="ptb-line"></span>
                 <span class="ptb-title">{{titles[1]}}</span>
            </div>
            <div class="panel-title-box">
                 <span class="ptb-line"></span>
                 <span class="ptb-title">{{titles[2]}}</span>
            </div>
        </div>    
        <section class="pc-content">
            
            <div class="pcc-wrap">
                <div class="pcc-box pcc-time">
                    <TimeList></TimeList>
                </div>
                <div class="pcc-box pcc-template">
                    <TemplateList></TemplateList>
                </div>
                <div class="pcc-box pcc-source">
                    <SourceSelect></SourceSelect>
                </div>
            </div>
        </section>
        <section class="pc-preview">
            <TimeChart></TimeChart>
        </section>
    </div>
</template>



<script scoped>

    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import pc from './pc'
    import TimeList from '@/base/time-list/time-list'
    import TemplateList from '@/base/template-list/template-list'
    import SourceSelect from '@/base/source-select/source-select'
    import TimeChart from '@/base/time-chart/time-chart'

    export default {
        data(){
            return {
                titles:['时间控制','模板选择','资源选择']
            }
        },
        methods:{
            initContainer(){
                var ms = this.$refs.content;
                var hh = document.body.offsetHeight;
                ms.style.overflow = 'hidden';
                window.addEventListener('resize',fn);
                

                function fn(){
                    hh = document.body.offsetHeight;
                    ms.style.height = hh + 'px';
                }

                fn();    
            }
            
        },
        created(){
            
        },
        mounted(){
            
        },
        components:{
            TimeList,
            TemplateList,
            SourceSelect,
            TimeChart
        }
    }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
    .pcc-title-content
        wh(96%,58px);margin:0 auto;
        .panel-title-box
          wh(30%,100%);line-height:58px;text-indent:40px;@extend .rp;float:left;
          &:nth-of-type(1)
            width:30%
          &:nth-of-type(2)
            width:20%
          &:nth-of-type(3)
            width:50%        
          .ptb-title
            wh(100%,100%);ab(0,0);color:#000;font-size:18px;letter-spacing:1px;
          .ptb-line
            wh(9px,24px);ab(0,50%);bgColor(#f0b551);-webkit-transform:translate3d(0,-50%,0);-moz-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0);    
      

    .pc-content
        wh(96%,0);margin:0 auto;padding-bottom:32%;@extend .rp;
        .pcc-wrap
            wh(100%,100%);ab(0,0);
            .pcc-box
              height:100%;overflow-y:auto;float:left;box-sizing:border-box;border:1px solid #f2f2f2;
            .pcc-time
              width:30%;
            .pcc-template
              width:20%;
            .pcc-source
              width:50%;overflow:hidden;
    .pc-preview
        wh(96%,auto);margin:0 auto;            

</style>