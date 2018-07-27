<template>
    <div class="source-container">
        <div class="sc-wrap" >
            <el-container >
              <el-header class="header-file" style="height:108px">
                  <el-row>
                    <el-col :span="24">
                        <div class="grid-content grid-content-btnwrap">
                            <el-button plain class="rbtn uploadFile" @click="goupRequest">上线</el-button>
                            <el-button plain class="rbtn newFolder" @click="deleteRequest">删除</el-button>
                        </div>
                    </el-col>
                </el-row>
              </el-header>
              
              <el-main >
                
                  <div class="scrollWrap" ref="menuScroll">
                    <el-scrollbar class="el-scrollbar-wrap">
                          <div v-show="folderDatas.length==0" style="font-size:16px;color:#333;height:60px;line-height:60px;text-indent:30px;">暂无节目资源，请前往节目控制发布或收藏节目！</div>
                          <div class="cwrap">
                              <list-view :folderSources="folderDatas" :folderExist="true" :programExist="true" ></list-view>
                          </div>
                      </el-scrollbar>
                  </div>
                  
              </el-main>
              
            </el-container>
        </div>

        <!-- 弹框 -->
        <el-dialog
        title="请选择设备"
        :visible.sync="dialogVisible"
        width="80%">

            <!-- 设备列表 -->
            <div class="tableBox">
                <!-- <el-radio-group v-model="radio">
                  <el-radio :label="index" :key="index" v-for="item,index in deviceLists">{{item.name}}</el-radio>
                </el-radio-group> -->
                <el-checkbox-group v-model="deviceListsChecked">
                  <el-checkbox :label="index" :key="index" v-for="name,index in deviceIndexLists">{{name}}</el-checkbox>
                </el-checkbox-group>
            </div>

            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="makeSureGetDevice">确 定</el-button>
            </span>

        </el-dialog>

    </div>
</template>


<script scoped >
    
    //import Scroll from '@/base/scroll/scroll';
    //import BScroll from 'better-scroll';
    import ListView from '@/base/list-view/list-view';
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import tool from 'common/js/tool'
    import wt from './wt.js'

    export default{
        data(){
            return {
                input: '',
                title: '草稿箱',
                listType: 'draft',
                get_drap_box_url: this.$baseUrl + '/api/getShow',
                delete_drap_box_url: this.$baseUrl + '/api/deleteShow',
                go_up_url: this.$baseUrl + '/api/pushShow',
                deviceList: this.$baseUrl+'/api/deviceList',
                folderDatas: [],
                items: [],
                get_current_program: this.$baseUrl+'/api/getLastShow',
                dialogVisible:false,
                deviceIndexLists: [],
                deviceListsChecked: [],
                pushId: []
            }
        },
        methods:{
            //点击确定后上线节目
            makeSureGetDevice(){

            },
            //初始化当前的节目
            initCurrentProgram(){
               if(/*!tool.sget('initOnoff')*/true){
                     //3. 节目请求
                    this.$axios.post(this.get_current_program).then((res)=>{
                       //console.log(JSON.parse(res.data.data));
                       if(res.data.status == 'success'){

                            //获取数据
                            //console.log(JSON.parse(res.data.data))
                            //根据已有资源重组
                            //var cd = wt.formatData(JSON.parse(res.data.data));
                            //console.log(cd)
                            
                            //设置本地存储
                            //tool.setCurrentProgram(cd);

                            //this.$router.go(0);
                            //location.reload();
                       }
                    })

                    tool.sset('initOnoff',true);
               }  

            },
            //初始化草稿箱数据
            initProgramData(){
                var datas = [];
                var prefix = '';
                this.folderDatas = [];

                //清除定时器
                if(tool.sget('timer')){
                    clearInterval(tool.sget('timer'));
                }

                for(var i=0;i<10000;i++){
                     clearInterval(i);
                }

                this.$axios.post(this.get_drap_box_url).then((res)=>{
                    if(res.data.status == "success"){
                        //console.log(res.data.data);
                        for(var i=0;i<res.data.data.length;i++){
                            var cimg = JSON.parse(res.data.data[i]['showContent']).img_url;
                            this.folderDatas.push({
                                'id': res.data.data[i]['id'],
                                'name': res.data.data[i]['name'],
                                'img':  cimg,
                                'showContent': res.data.data[i]['showContent']
                            });

                        }
                        
                        setTimeout(()=>{
                            //绑定删除事件
                            this.deletePrograms();
                        },300)
                    }
                })
            },
            //删除节目
            deletePrograms(){
                var items = document.getElementsByClassName('cc-item');
                var This = this;
                
                for(var i=0;i<items.length;i++){

                    items[i].index = i;
                    items[i].onclick = function(ev){

                        for(var j=0;j<items.length;j++){
                            if(j != this.index){
                                items[j].classList.remove('cactive');
                            }
                        }

                        this.classList.toggle('cactive');
                    }
                }
            },
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
            //安成设备选择
            makeSureGetDevice(){
                this.dialogVisible = false;

                var d = this.deviceListsChecked;
                
                for(var i=0;i<d.length;i++){
                  this.pushId.push(this.deviceLists[d[i]]['pushId']);
                }
                
                //遍曆要选择的
                var items = document.getElementsByClassName('cc-item');

                //获取要删除的文件
                var idArr = [];
                for(var i=0;i<items.length;i++){
                    if(items[i].classList.contains('cactive')){

                        //发出请求
                        this.$axios.post(this.go_up_url,{
                            directorie: this.folderDatas[i].showContent,
                            pushId: JSON.stringify(this.pushId)
                        }).then((res)=>{

                            if(res.data.status == "success"){
                               this.$message({
                                  message: res.data.message,
                                  type: 'success',
                                  showClose: true
                                });

                               this.initCurrentProgram();
                            }
                        })
                        break;
                    }
                }
            },
            //上线节目请求
            goupRequest(){
                
                var items = document.getElementsByClassName('cc-item');
                for(var i=0;i<items.length;i++){
                    if(!items[i].classList.contains('cactive'))
                    {
                        if(i == items.length - 1){
                            this.$message({
                              message: '请选择要上线的节目!',
                              type: 'error',
                              showClose: true
                            });
                            return;
                        }
                    }else{
                        this.dialogVisible = true;
                        return;
                    }
                }

            },
            //发出删除节目请求
            deleteRequest(){

                //遍曆要选择的
                var items = document.getElementsByClassName('cc-item');

                //获取要删除的文件
                var idArr = [];
                for(var i=0;i<items.length;i++){
                    if(items[i].classList.contains('cactive')){
                        this.$axios.post(this.delete_drap_box_url,{
                            'showId': items[i].dataset.id
                        }).then((res)=>{
                            if(res.data.status == "success"){
                               this.$message({
                                  message: res.data.message,
                                  type: 'success',
                                  showClose: true
                                });

                               //重新加载数据！
                               this.initProgramData();
                            }
                        })
                        break;
                    }else{
                        if(i == items.length-1){
                            this.$message({
                              message: '请选择要删除的节目!',
                              type: 'error',
                              showClose: true
                            });
                        }
                    }
                }

            },
            initScrollHeight(){
                
                let wrap = this.$refs.menuScroll;
                let winHeight = document.body.offsetHeight;
                let headHeight = 108;

                wrap.style.height = (winHeight - headHeight) + "px";
            },
            initContainer(){
                var ms = this.$refs.menuScroll;
                var hh = document.body.offsetHeight;
                ms.style.overflow = 'hidden';
                window.addEventListener('resize',fn);
                

                function fn(){
                    hh = document.body.offsetHeight;
                    ms.style.height = (hh - 108) + 'px';
                }

                fn();    
            }
        },
        mounted(){
            this.initContainer();
            setTimeout(()=>{
                this.deletePrograms();
            },300)
        },
        created(){
            this.getDeviceList();
            this.initProgramData();
        },
        components:{
            ListView
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    

    .el-scrollbar-wrap
        height:100%;
        .el-scrollbar__wrap
            overflow:auto;

     .btnStyle{
        bgColor(#F4F4F4);color:#333;font-size:18px;initp();border-radius:10px;
     }
    .scrollWrapBar
        overflow-y:auto;
    .source-container
        width:100%;height:100%;min-height:800px;
        
        .header-file
            height:108px;width:100%;border-bottom:2px solid #DEDEDE;
            .searchbox
                width:60%;float:left;
                input
                  @extend .btnStyle;text-indent:44px;bgImg('~common/images/source/search@2x.png');background-position:10px 7px;background-size:24px 23px;  
            .searchbtn
                width:20%;float:left;@extend .btnStyle;width:128px;hh(40px);mg(20px,34px);
            .rbtn
                float:right;margin-right:20px;margin-top:34px;width:128px;hh(40px);@extend .btnStyle;
            .uploadFile
                bgColor(#f0b551);color:#fff;
    .el-main
        background-color:none;color: #333;text-align: left;line-height: none;padding:0;
    .scrollWrap
        width:100%;background:#fff;
        .cwrap
            width:100%;height:1600px;box-sizing:border-box;height:auto;background:#fff;padding:0 30px;
    .el-header
        background-color: none;
        color: none;
        text-align: center;
        line-height: 108px;  
        

    @media screen and (max-width:500px)
        .source-container
            margin:0 auto;
            
        .header-file
            .grid-content-btnwrap
                width:100%;height:80px;overflow:hidden;
                .rbtn
                    clear:both;display:inline-block;margin:0;float:none;
</style>