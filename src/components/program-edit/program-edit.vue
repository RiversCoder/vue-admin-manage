<template>
    <div class="program-edit" >
        <header class="pe-header">
            <span class="pe-hspan pe-title">模块编辑</span>
            <span class="pe-hspan pe-sure-box"><el-button type="warning" @click.native="completeEdit">完成</el-button></span>
        </header>

        <section class="pe-selectors">
            <IS></IS>
        </section>

        <section class="pe-editor">
            <IB></IB>
        </section>

    </div>
</template>



<script scoped>

    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import IB from '@/base/interactive-box/interactive-box'
    import IS from '@/base/interactive-select/interactive-select'
    import pe from './pe'
    import pc from 'common/js/pc.js'

    export default {
        data(){
           return{
            publishData : []
           }
        },
        methods:{
            initWH(){
                var bodyH = $('body').height();
                var headerH = $('.pe-header').height();
                var peContainerH = $('.pe-container').height();

                var eH = bodyH - headerH - peContainerH;
                $('.pe-editor').height(eH)
            },
            completeEdit(){

                //timelists新增drags字段
                var tdata = pc.addTimeListDrags(this.getTimeList,this.getCid,this.getAllDragData);

                //格式化所有要上线的数据
                var data = pc.formatPublish(tdata,this.getAllDragData,this.getCid);
                
                //console.log(data);
                this.setTimeList(tdata);
                this.setPublish(data);
                this.setDragData([]);
                this.setDragBoxData([]);
                this.setModelId(-1);

                //设置model
                this.setEditEnable('');

                //跳转路由到主页
                this.$router.push({path:'/pc'});
            },
            ...mapMutations({
                'setTimeList': 'timeList',
                'setPublish': 'publishData',
                'setDragData': 'dragBoxs',
                'setDragBoxData': 'getAllDragBoxData',
                'setEditEnable': 'editEnable',
                'setModelId': 'select_model_id',
            })
        },
        computed:{
            ...mapGetters({
                getTimeList: 'timeList',
                getAllDragData: 'getAllDragData',
                getCid: 'timelist_cid'
            })
        },
        created(){
            
        },
        mounted(){
            
        },
        components:{
           IB,
           IS
        }
    }
    
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
    .pe-header
      wh(100%,80px);line-height:80px;border-bottom:1px solid #f1f1f1;
      .pe-title
          float:left;margin-left:30px;font-size:20px;
      .pe-sure-box
          float:right;margin-right:30px;             
    .pe-selectors
        wh(100%,0);padding-top:21%;bgColor(red);@extend .rp;
    .pe-editor
        wh(100%,0);padding-top:60%;margin:0 auto;@extend .rp;
</style>

