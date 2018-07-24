<template>
   <div class="con-container">
      <div class="Column">
          <h3 class="column-title">设备</h3>
          <div class="column-content">
                
               <div v-show="allsources.length==0" style="font-size:16px;color:#333;height:60px;line-height:60px;text-indent:30px;">暫無设备資源，請添加设备資源！</div>

                <dl class="cc-item" v-for="(item,index) in allsources" @click="clickActive(item.pushId)"  :data-id="item.pushId">
                      
                      <dt class="cc-item-previewbox">
                          <span class="cip-img">
                              <img :src=" item.is_online == 1 ? publishData[0] : publishData[1] " />
                          </span>
                          <span class="cip-mask" ></span>
                          <span class="cip-mask-online" v-if="item.is_online == 0"></span>
                          <span class="cip-text"> 当前状态：<font>{{ item.is_online == 1 ?'上线':'下线'}}</font> </span>
                          <!-- <span class="cip-icon cip-picon"></span> -->
                          <span class="cip-name">{{item.name.length<12?item.name:item.name.substr(0,12)+'...'}}</span>
                      </dt>


                      
                      <dd class="cc-item-textbox">
                          <ul class="citms">
                              <li class="cit cit1" @click.stop="renameDevice(item,item.name,item.pushId)">重命名</li>
                              <li class="cit cit2" @click.stop="upDevice(item.pushId)">上线</li>
                              <li class="cit cit3" @click.stop="downDevice(item.pushId)">下线</li>
                          </ul>
                      </dd>

                      <!-- 遮罩 -->
                      <div class="cc-con-box" :data-id="item.pushId"></div>
                </dl>
             
          </div>
        
      </div>

      <!-- <el-button type="text" @click="dialogTableVisible = true">打开嵌套表格的 Dialog</el-button> -->
    </div>
</template>


<script scoped >
  import tool from 'common/js/tool.js';
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    export default{
        data(){
            return{
                getDatas: [],
                remove_url: this.$baseUrl+'/api/deleteDevice',
                publishStatusUrl: this.$baseUrl + '/api/onlineStatus', //上线 1 下线 0
                rename_url: this.$baseUrl+'/api/renameDevice',
                move_url:this.$baseUrl+'/api/move',
                select_dir: '/',
                publishStatus: true,
                publishData: [require('@/common/images/term_back_sel.png'),require('@/common/images/term_back.png')]
            }
        },
        props: {
          devices: {
            type: Array,
            default: function(){
                return []
            }
          },
          allsources:{
            type: Array,
            default: function(){
                return []
            }
          }
        },
        methods:{

          //点击重命名图片
          renameDevice(item,cname,cid){

             console.log(this.allsources);

             this.$prompt('請輸入设备名稱', '溫馨提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                inputValue: cname
              }).then(({ value }) => {

                //检测value是否为空
                if(!tool.strim(value,'g')){
                   this.$message({
                      type: 'error',
                      message: '修改名稱失敗,名稱不能爲空!'
                    });
                   return;
                }
                
                value = tool.strim(value,'g');

                //检测是否含有 \ /字符
                var re = /\\\\*|\/*/g;
                var v = value.match(re);
                for(var i=0;i<v.length;i++){
                  if(v[i]){
                    this.$message({
                        type: 'error',
                        message: '非法名稱格式，名稱中不能帶有正反斜杠!'
                      });
                     return;
                  }
                }

                //发送修改名称请求
                this.$axios.post(this.rename_url,{
                    pushId: cid,
                    name: value
                }).then((res)=>{
                     //console.log(res);
                    //success
                    if(res.data.status == 'success'){
                        
                        this.$message({
                          type: 'success',
                          message: res.data.message
                        });
                        
                        this.$emit('initSelector');

                    }else{
                        this.$message({
                          type: 'danger',
                          message: res.data.message
                        });
                    }
                });

              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消輸入'
                });       
              });
          },
          //上线设备
          upDevice(cid){
            var arr = [];
            arr.push(cid);

            //上线设备
            this.$axios.post(this.publishStatusUrl,{
                pushId: JSON.stringify(arr),
                is_online: 1
            }).then((res)=>{

                if(res.data.status == 'success'){
                    
                    this.$message({
                      type: 'success',
                      message: res.data.message
                    });
                    
                    this.$emit('initSelector');

                }else{
                    this.$message({
                      type: 'danger',
                      message: res.data.message
                    });
                }

            });
              
          },
          //下线设备
          downDevice(cid){
            var arr = [];
            arr.push(cid);

            //上线设备
            this.$axios.post(this.publishStatusUrl,{
                pushId: JSON.stringify(arr),
                is_online: 0
            }).then((res)=>{
                
                if(res.data.status == 'success'){
                    
                    this.$message({
                      type: 'success',
                      message: res.data.message
                    });
                    
                    this.$emit('initSelector');

                }else{
                    this.$message({
                      type: 'danger',
                      message: res.data.message
                    });
                }
            });
          },
          //点击选中
          clickActive(id){

            $('.cc-con-box').each(function(){
              if(this.dataset.id == id){
                $(this).toggleClass('cc-con-box-active');
              }
            });

          },
          ...mapMutations({
            setSource : 'source'
          })
        },
        computed:{
          ...mapGetters(['source'])
        },
        mounted(){
          //this.initClickManyUpDown();
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
    .con-container
            width:100%;box-sizing:border-box;height:auto;background:#fff;padding-bottom:30px;
            
    .Column
        width:100%;height:auto;initp();
        
        .column-title
            font-size:20px;color:#666;hh(70px);text-indent:28px;position:relative;
            &:before
                content:'';@extend .block;wh(9px,24px);bgColor(#f0b551);position:absolute;left:0px;top:23px;
        
        .column-content
            wh(100%,auto); display:-webkit-flex;display:flex;-webkit-justify-content:flex-start;justify-content:flex-start;-webkit-flex-wrap: wrap;flex-wrap: wrap;
               
            .cc-item
                wh(238px,184px);box-sizing:border-box;border:1px solid #DEDEDE;border-radius:6px 6px 0 0;margin-top:30px;position:relative;z-index:10;margin-left:8px;float:left;
                
                .cc-item-previewbox
                    wh(236px,135px);position:relative;background:#F4F4F4;box-sizing:border-box;border-bottom:1px solid #DEDEDE;
                    
                    .cip-icon
                        wh(20px,20px);bgImg('~common/images/source/video@2x.png');ab(14px,105px);
                    .cip-picon
                          bgImg('~common/images/source/img@2x.png');
                    .cip-name
                        wh(100%,16px);hh(16px);ab(0px,106px);text-align:center;font-size:16px;color:#fff;
                    .cip-img
                        wh(100%,100%);ab(0,0);
                        img
                          wh(100%,100%);border-radius:6px 6px 0 0;       
                    .cip-text
                        font-size:13px;color:#fff;ab(5px,10px);
                    .cip-mask
                      wh(100%,100%);ab(0,0);bgColor(rgba(0,0,0,0.3));
                    .cip-mask-online
                      wh(100%,100%);ab(0,0);bgColor(rgba(0,0,0,0.3));


                    

                .cc-item-textbox
                    wh(236px,47px);bgColor(#fff);box-sizing:border-box;
                    .cit
                        float:left;width:33.3%;font-size:14px;color:#333;text-align:center;cursor:pointer;line-height:47px;position:relative;
                        &:before
                            content:'';display:block;wh(1px,15px);abs();right:0;top:50%;transform:translateY(-50%);bgColor(#aaa);
                        &:hover
                            text-decoration:underline;
                    .cit
                      &:nth-of-type(3)
                       &:before
                        display:none; 

                .cc-con-box
                  wh(100%,100%);ab(0,0);box-sizing:border-box;border-radius:6px 6px 0 0;display:none;
                .cc-con-box-active
                  display:block;bgColor(rgba(70,150,209,0.2));border:2px solid #4696d1;                             

    @media screen and (max-width:500px)
      .Column
        .column-content 
            justify-content: center; 
</style>