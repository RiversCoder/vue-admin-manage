<template>
    <div class="source-container">
        <div class="sc-wrap" >
            <el-container >
              <el-header class="header-file" style="height:70px">
                  <el-row>
                    <el-col :span="24">
                        <div class="grid-content grid-content-btnwrap">
                            <el-button plain class="rbtn newFolder" @click.native="selectUpDown(0)">选中下线</el-button>
                            <el-button plain class="rbtn uploadFile" @click.native="selectUpDown(1)">选中上线</el-button>
                        </div>
                    </el-col>
                </el-row>
              </el-header>
              
              <el-main>
                  <div class="scrollWrap" ref="menuScroll">
                    <el-scrollbar class="el-scrollbar-wrap">
                          <div class="cwrap" >
                              <device-source :allsources="deviceLists" @initSelector="getDeviceList" ></device-source>
                          </div>
                    </el-scrollbar>
                  </div>
              </el-main>
              
            </el-container>
        </div>




    </div>
</template>


<script scoped >
    
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
    import tool from 'common/js/tool'
    import DeviceSource from '@/base/device-source/device-source'

    export default{
        data(){
            return {
                deviceData: [],
                deviceList: this.$baseUrl+'/api/deviceList',
                publishStatusUrl: this.$baseUrl+'/api/onlineStatus',
                deviceIndexLists: [],
                deviceLists: []
            }
        },
        methods:{
            //获取设备列表
            getDeviceList(){
                this.$axios.post(this.deviceList).then((res)=>{
                  if(res.data.code == 200){
                    this.deviceLists = res.data.data;
                    for(var i=0;i<this.deviceLists.length;i++){
                      this.deviceIndexLists.push(this.deviceLists[i]['name']);
                    }
                  }else{
                    this.$message({
                      showClose: true,
                      message: '获取设备列表失败！',
                      type: 'error'
                    });
                  }
                }); 
            },
            //选中上线
            selectUpDown(online){

              var ids = [];
              $('.cc-con-box-active').each(function(){
                ids.push(this.dataset.id);
              });

             if(ids.length == 0){
               this.$message({
                  type: 'warning',
                  message: '请选择设备',
                  showClose: true
                });
              return;
             }

              //上线设备
              this.$axios.post(this.publishStatusUrl,{
                  pushId: JSON.stringify(ids),
                  is_online: online
              }).then((res)=>{
                  
                  if(res.data.status == 'success'){
                      
                      this.$message({
                        type: 'success',
                        message: res.data.message
                      });
                      
                      this.getDeviceList();

                      //移除状态
                      $('.cc-con-box').each(function(){
                        $(this).removeClass('cc-con-box-active');
                      });

                  }else{
                      this.$message({
                        type: 'danger',
                        message: res.data.message
                      });
                  }
              });

            },
            initClickManyUpDown(){
              $('.cc-item').click(function(){
                
                //$(this).toggleClass('cc-con-box-active');
              });
            }
        },
        mounted(){
            //this.initClickManyUpDown();
        },
        created(){
           this.getDeviceList();
        },
        components:{
            DeviceSource
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
    .scrollWrap
      padding-left:10px;padding-right:10px;

    .header-file
      border-bottom:1px solid #dedede;
    .grid-content
      @extend .rp;hh(70px);
      .rbtn
        float:right;margin-right:10px;margin-top:15px;

</style>