var fs = {
    checkFolderNameRepeat(v,ov,vs){

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
    }
};

export default fs;