<template>
    <div class="histogram">
        <ul class="hisLists">
            <li class="hitem hitem1" v-for="name in weeks">
                <div class="child-lists-wrap">
                    <span class="cwb"></span>
                </div>
                <ul class="child-lists">
                    <li class="citem" v-for="item in array"></li>
                </ul>
                <span class="ctitle">{{name}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
    
    import tool from 'common/js/tool'
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';

    export default{
        data(){
            return {
                currentTimeLists: [],
                weeks: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
                array:[0,0,0,0,0,0,0,0,0,0,0,0]
            }
        },
        props:{
            onOff:{
                type:Boolean,
                default: false
            }
        },
        methods:{
           initTimeLists(){

                /*
                    1. 需要格式： { start: "0", duration: "86400", weeks: "16", date: "fri", time: "00:00-24:00" }
                    2. 目前的格式: { days: "Mon,Tue,wed",duration:1200,id:"RRwyYHJzPC",rects:[{…}],start::0,template:1,time:"00:00-00:20",weeks:56 }
                
                */

                var clists = this.getTimeLists;

                //格式化数据
                this.currentTimeLists = tool.new_formatChartData(this.getTimeLists);
           },
           draw(){

                //檢測本地是否有值
                //tool.checkTimelists();
                //console.log('重新繪制');
                //清除所有 重繪
                
                //console.log(this.checkStorage())
                if(this.checkStorage()){
                   
                    //1. 繪制工作日時間
                    //this.drawWorkDay('#446FCB','time_list_on');
                    
                    //2. 繪制非工作日時間
                    // this.drawWorkDay('#49B869','time_list_off');

                    //3. 繪制全屏
                    //this.drawWorkDay('#F58E1F','time_list_full');
                }
           },
           checkStorage(){
                if((tool.lget('time_list_on')&&tool.lget('time_list_on').length > 0) || (tool.lget('time_list_off')&&tool.lget('time_list_off').length > 0) || (tool.lget('time_list_full')&&tool.lget('time_list_full').length > 0)){
                    return true;
                }else{
                    return false;
                }
           },
           drawWorkDay(){
                            
                var arr = tool.handleTime(this.currentTimeLists);
                //console.log(arr);
                var height = 144;

                //2. 換算比例
                var harr = tool.countPercent(height,arr);
                
                //return;
                //3. 清除以前 生成色塊
                tool.reDraws('child-lists-wrap');
                tool.new_createColorblock('child-lists-wrap','cwb',harr);
                //console.log('123');
                //return;
                //繪制衝突的時間段
                tool.drawRedConflict();
           }
        },
        computed:{
            ...mapState({
                state_timelists: 'timeList'
            }),
            ...mapGetters({
                getTimeLists: 'timeList'
            })
        },  
        watch:{
            getTimeLists: {
                handler(ov,nv){
                    //重新初始化数据
                    this.initTimeLists();
                    this.drawWorkDay();
                },
                deep: true
            }
        },
        created(){
           this.initTimeLists();
        },
        mounted(){
            this.drawWorkDay();
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"    

    .hisLists
        wh(550px,180px);
        .hitem
            wh(55px,180px);margin-right:23px;float:left;position:relative;
        .hitem7
            margin-right:0;
        .child-lists-wrap
            wh(55px,143px);bgColor(#DEDEDE);position:absolute;
            .cwb
                display:block;width:100%;position:absolute;left:0;
        .child-lists
            list-style:none;wh(55px,143px);position:absolute;z-index:11;
            .citem
                width:100%;height:12px;box-szing:border-box;border-bottom:1px solid #fff;
        .ctitle
            display:block;width:100%;font-size:18px;color:#333;text-align:center;margin-top:8px;position:absolute;bottom:0;                             
</style>