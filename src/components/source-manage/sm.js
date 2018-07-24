
var sm = {
    //格式化当前的目录
    formatCatas(dirs){
        var obj = {
            name: '',
            dir: '',
        }
        var arr = [];
        var str = '/';
        var dirArr = [{
            name: '所有文件',
            dir: '/'
        }];
        

        //格式化dir成数组
        arr = dirs.split('/');
        for(var i=0;i<arr.length;i++){
            if(!arr[i]){
                arr.splice(i,1);
            }
        }

        //再次格式化
        for(i=0;i<arr.length;i++){
            str += (arr[i]+ '/');
            dirArr.push({
                'name': arr[i].length<=5?arr[i]:arr[i].substr(0,3)+'..',
                'dir': str
            });
        }

        return dirArr;
    },
    requestContent(axios,url,dir){
        axios.post(url,{
          dir: dir
        }).then((res)=>{
            console.log(res);
        });
    },
    checkFolderNameRepeat(v,vs){

        var mes = {
            status: false,
            message: ''
        };

        //匹配
        for(var i=0;i<vs.length;i++){
            if(v == vs[i].name){
                mes.message = '操作失敗，文件夾重名！';
                mes.status = true;

                return mes;
            }
        }

        return mes;
    },
    getFolders(axios,url,cdir,fn){
        var datas = [];
        var nDatas = [];

        axios.post(url,{
          dir: cdir
        }).then((res)=>{
            //success
            if(res.data.status == 'success'){
                 datas = res.data.data;
                 nDatas = [];
                 for(var i=0;i<datas.length;i++){
                    if(datas[i].fileType == 2){
                        nDatas.push(datas[i]);
                    }
                 }
            }
            fn&&fn(nDatas);
        });
    }
};

export default sm;