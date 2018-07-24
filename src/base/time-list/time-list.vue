<template>
    <div>


        <div class="timeListWrap">
          
          <div class="tlistwrap" >
              <ul class="tlists">
                  <li class="bitem bitem1" v-for="item,index in newdatas" :data-id="item.id" @click.stop = "toggleActiveClick(index,item) ">
                      <span class="bitem-item bitem-time">{{ item.time }}</span>
                      <span class="bitem-item bitem-day">
                          {{ item.days }}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="listSvgBox" width="50px" height="32px" viewBox="0 0 50 32" preserveAspectRatio="xMidYMid meet">
                        <g class="rectBoxWrap">
                          <rect v-for="el in item.rects" v-bind:x="el.x" v-bind:y="el.y" v-bind:width="el.w" v-bind:height="el.h"  class="rectBox"  />
                        </g>
                      </svg>
                      <el-button type="danger" icon="el-icon-delete" class="listDeleteBtn" @click.stop.native="deleteList(item,index)"></el-button>
                  </li>
              </ul>
              <span class="add-bitem-btn" @click="dialogFormVisible = true;"></span>
          </div>
        </div>


        <el-dialog title="選擇播放時段" :visible.sync="dialogFormVisible">
          
          <el-time-select v-model="value1" :picker-options="{ start: '00:00', step: '00:10', end: '24:00' }" placeholder="請選擇時間"></el-time-select>
          <el-time-select v-model="value2" :picker-options="{ start: '00:00', step: '00:10', end: '24:00' }" placeholder="請選擇時間"></el-time-select>

          <div class="checkboxs"> 
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="Sun"></el-checkbox>
                <el-checkbox label="Mon"></el-checkbox>
                <el-checkbox label="Tue"></el-checkbox>
                <el-checkbox label="wed"></el-checkbox>
                <el-checkbox label="Thu"></el-checkbox>
                <el-checkbox label="Fri"></el-checkbox>
                <el-checkbox label="Sat"></el-checkbox>
              </el-checkbox-group>
          </div>    
        
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="closeSure">確 定</el-button>
          </div>

        </el-dialog>


    </div>
</template>

<script>
    
    import tool from 'common/js/tool';
    import BScroll from 'better-scroll';
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
    import svgs,{ templates } from '@/common/js/templates.js';
    import tl from '@/common/js/pc.js';

    export default{
        data(){
            return {
              ctitle:'时间控制',
              dialogFormVisible: false,
              value1: '',
              value2:'',
              checkList: [],
              setTimes:[],
              svgBox:{
                w:50,
                h:32
              },
              newdatas:[],
              timelists:[],
              datas:[]
            } 
        },
        methods:{
          
          //初始化获取时间列表数据
          getNewData(){
            //1. 时间列表
            this.newdatas = tl.formatTimeListData(svgs,this.svgBox,this.getTimeList);

            //2. 激活状态
            this.setActiveStatusById(this.getCid);
          },
          //删除 时间列表
          deleteList(item,index){

            //检测被删除项是否是被选中项
            if(item.id == this.getCid){
              this.$store.commit('timelist_cid',-1);
            }

            this.newdatas.splice(index,1);

            // vuex 更新时间列表 
            this.setTimeList(tl.deleteTimeListById(this.getTimeList,item.id));
            
          },
          //添加 時間和星期
          closeSure(){

              var times = [];
              this.dialogFormVisible = false;

              //驗證
              if(this.checkList.length==0 || !this.value1 || !this.value2){
                  this.$message.error('時間或星期不能爲空!');
                  return;
              }
              //驗證時間大小
              if(tool.changeTimetoSecond(this.value1) >= tool.changeTimetoSecond(this.value2)){
                  console.log(this.value1,this.value2)
                  this.$message.error('親，時間先後順序設置錯誤！');
                  return;
              }

              //計算時間衝突
              if(tool.checkTime(this.getTimeList,tool.countTimes(this.value1,this.value2,this.checkList))){
                  this.$message({
                    message: '時間設置衝突,請重新設置!',
                    type: 'warning'
                  });
                  return;
              }

              //格式化时间选项
              times = tl.formatSelectDate({s:this.value1,e:this.value2,week:this.checkList});
              this.timelists = tl.addFormatTimeListData(svgs,this.getTimeList,times);

              //全局vuex存储
              this.$store.commit('timeList',this.timelists);
          },
          //active 切换 修改vuex ID 状态值
          toggleActiveClick(index,item){
            //console.log(e.srcElement);
            this.setCid($('.bitem').eq(index).get(0).dataset.id);
          },
          setActiveStatusById(id){
            console.log(id);
            $('.bitem').each(function(el){
                $(this).removeClass('bitemActive');
                if(this.dataset.id == id){
                  $(this).addClass('bitemActive');
                }
            });
          },
          ...mapMutations({
            setTimeList: 'timeList',
            setCid: 'timelist_cid'
          }) 
        },
        computed:{
          ...mapState({
            state_cid: 'timelist_cid',
            state_tlist: 'timeList'
          }),
         ...mapGetters({
            getTimeList: 'timeList',
            getCid: 'timelist_cid'
         })
        },
        watch:{
           getTimeList:{
            handler(ov,nv){
              this.getNewData();
            },
            deep: true
           },
           getCid(v1,v2){
            this.setActiveStatusById(v1);
           }
        },
        mounted(){
          //this.initEvent();
          this.getNewData();
        },
        updated(){
          //this.initEvent();
          //console.log(this.getCid,this.getTimeList);
        },
        created(){
          this.getNewData();
        },
        components:{

        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"    
    
    .timeListWrap
      wh(100%,auto);
      .tlists
        wh(100%,auto);
        .bitem
          wh(100%,60px);border-bottom:1px solid #f2f2f2;line-height:45px;box-sizing:border-box;padding-left:20px;color:#9a9a9a;font-size:16px;@extend .rp;
          .bitem-day
            @extend .block;font-size:12px;abs();left:20px;bottom:6px;line-height:14px;height:14px;
            i
              font-style:normal;
          .listDeleteBtn
            height:100%;width:32px;abs();right:0;top:0;br(0);text-align:center;padding:20px 15px 20px 10px;opacity:0.2;
            &:hover
              opacity:.8;
          .listSvgBox
            wh(50px,32px);border:1px solid red;abs();right:50px;top:50%;transform:translateY(-50%);bgColor(rgba(231,231,231,1));
            .rectBox
              stroke-width:1px;stroke:#c9c9c9;fill:none;
          .listSvgBoxActive
            background:#e7e7e7;
        .bitemActive
          background:#fae2c0;
          .listSvgBox
            border:1px solid green;bgColor(rgba(231,231,231,0));      
            
      .add-bitem-btn
        @extend .block;wh(100%,40px);border-bottom:1px solid #f2f2f2;@extend .rp;cursor:pointer;bgImg('~common/images/worktime/add.png');background-size:20px 20px;background-position:center center;bgColor(#f4f4f4);
              
                                                     
</style>


