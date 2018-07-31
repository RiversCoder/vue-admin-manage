
var tool = {
    formatDate: function(cdate,fmt){

            var o = {
                "M+": cdate.getMonth() + 1, //月份 
                "d+": cdate.getDate(), //日 
                "h+": cdate.getHours(), //小时 
                "m+": cdate.getMinutes(), //分 
                "s+": cdate.getSeconds(), //秒 
                "q+": Math.floor((cdate.getMonth() + 3) / 3), //季度 
                "S": cdate.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (cdate.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) 
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
    },
    changeFormat: function(data){
        
        var newData = {};

        for(var key in data){
            newData['file_name'] = data['name'];
            newData['file_type'] = data['fileType'];
            newData['download_url'] = data['url'];
            newData['file_duration'] = data['videoTime'];
            newData['file_size'] = data['size'];
            newData['id'] = data['id'];
            newData['img'] = data['img'];
        }

        return newData;
    },
    getSelect: function(item,clsn,rs,d){
       
        item.parentNode.classList.toggle(clsn);

        var data = this.lget('file_list_'+rs) ? this.lget('file_list_'+rs) : [];
        var record = [];

        if(item.parentNode.classList.contains(clsn)){
            
            data.push(this.changeFormat(d))
            
            //数组去重复    
            record = [...new Set(data)];

        }else{
            for(var i=0;i<data.length;i++){
                if(data[i].id == d.id){
                  data.splice(i,1);
                }
            }
            record = data;
        }

        //存入本地
        this.lset('file_list_'+rs,data);
        
        return record;
    },
    concatArray: (arr1,arr2)=>{
        let newArr = [];

        for(var i=0;i<arr1.length;i++){
            newArr.push(arr1[i]);
        }

        for(i=0;i<arr2.length;i++){
            newArr.push(arr2[i]);
        }

        return newArr;
    },
    //获取上传视频的总长度
    getVideoDuration: function(file){
        var duration = 0;
        var video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.preload = 'metadata';

        var promise = new Promise(
            function(resolve,reject){
                video.onloadedmetadata = function() {
                    URL.revokeObjectURL(video.src);
                    duration = video.duration; 
                    resolve(duration);
                    video.remove();
                }
            }
        )

        return promise;
    },
    //检测上传文件的类型
    checkFileType(file){
        var reImg = /image/g;
        var reVideo = /video/g;

        if(reImg.test(file.type)){
            return 0;
        }else if(reVideo.test(file.type)){
            return 1;
        }
    },
    //配置文件上传获取签名的参数
    getUploadAttr: function(file,cdir,fn){
        //默认参数
        let attr = {
            fileName: '',
            dir: cdir,
            fileType: 0,
            videoTime: 0
        }; 

        //1. 检测上传文件类型
        var type = this.checkFileType(file);

        //2. 配置参数
        attr.fileName = file.name;

        //3.如果是视频类型
        if(type === 1){
            this.getVideoDuration(file).then((dur)=>{
                attr.fileType = 1;
                attr.videoTime = dur;
                fn(attr);
            });
        }else{
            fn(attr);
        }
    },
    //随机文件名字符串
    randomString: function (len) {
    　　len = len || 32;
    　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
    　　var maxPos = chars.length;
    　　var pwd = '';
    　　for (var i = 0; i < len; i++) {
        　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    //取文件后缀名称
    getBackname: function(file){
        var re = /\.[^\.]+$/;
        var houzui = re.exec(file.name);
        return houzui[0];
    },
    //将字符串转换成2进制
    stringToHex: function(str){
　　　　 var shi = parseInt(str,2);
        //var shiliu = shi.toString(16);

        return shi;
　　},
    //设置本地存储对象
    lset: function(name,value){
        localStorage.setItem(name, JSON.stringify(value));
    },
    lget: function (name) {
        return JSON.parse(localStorage.getItem(name))
    },
    ladd: function (name, addVal) {
        let oldVal = this.lget(name)
        let newVal = oldVal.concat(addVal)
        this.lset(name, newVal)
    },
    //设置session本地存储对象
    sset: function(name,value){
        sessionStorage.setItem(name, JSON.stringify(value));
    },
    sget: function (name) {
        return JSON.parse(sessionStorage.getItem(name))
    },
    sadd: function (name, addVal) {
        let oldVal = this.sget(name)
        let newVal = oldVal.concat(addVal)
        this.sset(name, newVal)
    },
    //计算并且统计时间
    countTimes: function(time1,time2,weeks){
        var t1 = this.changeTimetoSecond(time1);
        var t2 = this.changeTimetoSecond(time2) - t1;
        var w = this.stringToHex(this.changeWeek(weeks));
        
        return {
          'time': time1+'-'+time2,
          'date': weeks.join(','),
          "start": t1,
          "duration": t2,
          "weeks":  w
        }
    },
    //把星期换算成十六进制
    changeWeek(week){
        var weekIndex = {'sun':0,'mon':1,'tue':2, 'wed': 3, 'thu': 4, 'fri':5, 'sat': 6};
        var initWeekArr = [0,0,0,0,0,0,0];

        //获取坐标
        var getIndexs = [];

        for(var i=0;i<week.length;i++){
            getIndexs.push(weekIndex[week[i].toLowerCase()])
        }

        for(i=0;i<getIndexs.length;i++){
            initWeekArr[getIndexs[i]] = 1;
        }

        return initWeekArr.join('');
    },
    //把时间换算成秒
    changeTimetoSecond(time){
        var arr = time.split(':');
        var senconds = arr[0]*60*60 + arr[1]*60;
        return senconds;
    },
    //处理时间成数组返回
    handleTime: function(data)
    {   

        var os = [];
        var ms = []; 

        //注意： 进制处理
        for(var i=0;i<data.length;i++){
           var str = parseInt(data[i].weeks,10).toString(2);
           ms.push([data[i].start,data[i].duration,this.addZoomBefore(str,7)]);
        }


        return ms;
    },
    //前面补零
    addZoomBefore(str,len){
        var dis = 0;
        var s = '';

        if(str.length < len){
            dis = len - str.length;

            for(var i=0;i<dis;i++){
                s += '0'
            }

            return (s+str);
        }else{
            return str;
        }

    },
    //换算比例 把时间换算成高度
    countPercent(ih,arr){

        var tH = 24*60*60;
        var per = ih/tH;

        var newArr = [];
        for(var i=0;i<arr.length;i++){
            newArr.push([Math.floor(arr[i][0]*per),Math.floor(arr[i][1]*per),arr[i][2]]);
        }
        
        return newArr;
    },
    //创建颜色块
    createColorblock(pclsn,clsn,data,color,storageName){
        var p = document.getElementsByClassName(pclsn);
        
        for(var i=0;i<data.length;i++){
            for(var j=0;j<p.length;j++){
                //console.log(data[i][2].charAt(j))
                if(data[i][2].charAt(j)*1 == 1){
                    p[j].innerHTML += `<span class="cwb" data-storage="${storageName}" style="display:block;width:100%;position:absolute;left:0;top:${data[i][0]}px;height:${data[i][1]}px;background-color:${color};"></span>`;
                }
            }
        }
        
    },
    checkTime: function(arr1,obj){
        
        var x1 = 0;
        var x2 = 0;
        var t1 = obj.start;
        var t2 = t1+obj.duration;

        var w1 = [];
        var w2 = this.addZoomBefore(parseInt(obj.weeks,10).toString(2),7);

        for(var i=0;i<arr1.length;i++){
            w1.push(this.addZoomBefore(parseInt(arr1[i].weeks,10).toString(2),7));
        }

        for(var i=0;i<arr1.length;i++){
            x1 = arr1[i].start;
            x2 = x1+arr1[i].duration;

             //如果不重叠
            if(t2 <= x1 || t1 >= x2){

                if(i == arr1.length-1){
                    return false;
                }
                
            }else{

                //如果时间重叠但星期不重叠就可以通过
                for(var j=0;j<w1.length;j++){
                    for(var m=0;m<w2.length;m++){
                        if(w2[m] == 1 && w1[j][m] == 1){
                            return true;
                        }else{
                            if(j == w1.length-1 && m == w2.length-1){
                                return false;
                            }
                        }
                    }
                }    
            }

        }
    },
    checkTimeList: function(arr1,obj){
        
        var x1 = 0;
        var x2 = 0;
        var t1 = obj.start;
        var t2 = t1+obj.duration;

        var w1 = [];
        var w2 = this.addZoomBefore(parseInt(obj.weeks,10).toString(2),7);

        for(var i=0;i<arr1.length;i++){
            w1.push(this.addZoomBefore(parseInt(arr1[i].weeks,10).toString(2),7));
        }

        for(var i=0;i<arr1.length;i++){
            x1 = arr1[i].start;
            x2 = x1+arr1[i].duration;

             //如果不重叠
            if(t2 <= x1 || t1 >= x2){

                if(i == arr1.length-1){
                    return false;
                }
                
            }else{

                //如果时间重叠但星期不重叠就可以通过
                for(var j=0;j<w1.length;j++){
                    for(var m=0;m<w2.length;m++){
                        if(w2[m] == 1 && w1[j][m] == 1){
                            return true;
                        }else{
                            if(j == w1.length-1 && m == w2.length-1){
                                return false;
                            }
                        }
                    }
                }    
            }

        }
    },
    //组装数据
    packageData: function(username){
        //1. 格式
        var programs = {
            "date": tool.formatDate(new Date(),"yyyy-MM-dd hh:mm:ss"),
            'img_url':'',
            "username": username,
            "program":[],
            "url_prefix": "https://skylander-dbs.oss-cn-hongkong.aliyuncs.com"
        }

        var program = {};
        var model_type_1 = {}; 
        var model_type_2 = {}; 
        var model_type_3 = {};    

        //2. 统计公共节目状态
        model_type_1 = this.cProgamWorkStatus('file_list_on','time_list_on');
        model_type_2 = this.cProgamWorkStatus('file_list_off','time_list_off');
        model_type_3 = this.cProgamWorkStatus('file_list_full','time_list_full');        

        
        if(model_type_1 || model_type_2 || model_type_3){
            
        }else{
            return false;
        }

        program = {
            'model_type_1': model_type_1,
            'model_type_2': model_type_2,
            'model_type_3': model_type_3
        }

        
        programs['program'] = program;
        programs['img_url'] = this.img_url;

        return programs;
    },
    cProgamWorkStatus(sfn,stn){

        var data  = this.lget(sfn);
        var tdata = this.lget(stn);
        var file_list = [];
        var time_list = [];
        var obj = {};

        if(!data || !tdata || data.length == 0 || tdata.length == 0){
            return {
                file_list:[],
                time_list:[]
            };
        }


        if(data.length > 0){
            this.img_url = data[Math.floor(data.length*Math.random())].img;
        }


        for(var i=0;i<data.length;i++){
            file_list.push({
                  "file_id":data[i].id,
                  "file_type":data[i].file_type,
                  "download_url": tool.replaceUrl(data[i].download_url,'https://skylander-dbs.oss-cn-hongkong.aliyuncs.com'),
                  "file_size":data[i].file_size,
                  "file_duration":parseInt(data[i].file_duration) ? parseInt(data[i].file_duration) : 15
            })
        }

        for(var i=0;i<tdata.length;i++){
            time_list.push({
              "start":tdata[i].start,
              "duration":tdata[i].duration,
              "weeks":tdata[i].weeks
            })
        }

        obj = {
            'file_list' : file_list,
            'time_list' : time_list
        };

        return obj;
    },
    replaceUrl(nUrl,str){
        return nUrl.replace(str,'');
    },
    checkTimelists: function(){
        var t1 = this.lget('time_list_on');
        var t2 = this.lget('time_list_off');
        var t3 = this.lget('time_list_full');

        if(t1.length>0 || t2.length>0 || t3.length>0){
            return true;
        }else{
            return false;
            //清空所有色块
        }
    },
    //重绘
    reDraws: function(pcls){
        //删除以前所有的数据
        //重新绘制
        var parents = document.getElementsByClassName(pcls);
        //var cls = document.getElementsByClassName(cls);

        for(var i=0;i<parents.length;i++){
            parents[i].innerHTML = '';
        }
        
    },
    drawRedConflict: function(){

        var locals = ['time_list_on','time_list_off','time_list_full'];
        var arrs = [];
        var alls = [];

        for(var i=0;i<locals.length;i++){

            if(!!tool.lget(locals[i]) && tool.lget(locals[i]).length>0){
                var data = tool.lget(locals[i]);
                var arr = tool.handleTime(data);

                var height = 144;

                //2. 换算比例
                var harr = tool.countPercent(height,arr);

                arrs.push(harr);
            }else{
                continue;
            } 
        }

        for(var i=0;i<arrs.length;i++)
        {
            for(var j=0;j<arrs[i].length;j++){
                alls.push(arrs[i][j]);
            }
        }  
        
        this.countWeeksTimes(alls);
    },
    //统计每个星期对应的所有时间段
    countWeeksTimes: function(alls){
        var weeks = ['sun','mon','tue','wed','thr','fri','sat'];
        var day = '';
        var timelines = '';
        var ts = {
            'sun': [],
            'mon': [],
            'tue': [],
            'wed': [],
            'thr': [],
            'fri': [],
            'sat': []
        };
        var arr = new Array();

        var key = 0;
        for(var i=0;i<alls.length;i++){
           timelines = alls[i][2];
           for(var n=0;n<timelines.length;n++){
                if(timelines[n] == 1){
                    day = weeks[n];
                    arr = new Array();
                    ts[day].push([alls[i][0],alls[i][1]]);
                }
           }
        }

        this.getRedBoxArray(ts);
    },
    getRedBoxArray(data){
        var datas = data;
        var arr = [[12,43],[22,10]];
        var rArr = [];
        var newPos = [];
        var redboxs = {
            '0' : [],
            '1' : [],
            '2' : [],
            '3' : [],
            '4' : [],
            '5' : [],
            '6' : []
        }
        var index = 0;
        var cv = null;

        for(var key in datas){
            //获取一周中每一天的新坐标
            if(datas[key].length>1){
                for(var i=0;i<datas[key].length;i++){
                    cv = datas[key][i];
                    for(var j=i+1;j<datas[key].length;j++){
                        //获取红色区块坐标二位数组
                        if(this.getRepeatBox(datas[key][j],cv)){
                            redboxs[index].push(this.getRepeatBox(datas[key][j],cv))
                        }
                    }
                }
            }

            index++;
        }



        //绘制红色区块
        this.drawRedBox(redboxs);
    },
    drawRedBox(data){

        var p = document.getElementsByClassName('child-lists-wrap');
        
        for(var key in data){
           for(var i=0;i<data[key].length;i++){
                p[key].innerHTML += `<span class="cwb cwb-repeat" style="display:block;width:100%;position:absolute;left:0;top:${data[key][i][0]}px;height:${data[key][i][1]}px;background-color:red;z-index:10;"></span>`;
           }
        }

    },
    //一对坐标对比算法
    getRepeatBox(arr1,arr2){
        var s1 = arr1[0];
        var e1 = s1 + arr1[1];

        var s2 = arr2[0];
        var e2 = s2 + arr2[1];

        var ns = 0;
        var ne = 0;

        //检测是否重叠
        //1. 如不不重叠
        if(e2 <= s1 || s2 >= e1){
            return false;
        }else{
            //1. 完全外包裹重叠
            if(s1>=s2 && e1<=e2){
                ns = s1;
                ne = e1;
            }
            //2.完全内包裹重叠
            if(s1<=s2 && e2<=e1){
                ns = s2;
                ne = e2;
            }
            //3. 上半部分重叠
            if(s2<s1 && e2>s1 && e2<e1){
                ns = s1;
                ne = e2;
            }
            //4. 下半部分重叠
            if(e2>e1 && s2>s1 && s2<e1){
                ns = s2;
                ne = e1;
            }

            return [ns,ne-ns];  
        }
    },
    //检测时间是否重复
    checkTimeRepeat: function(){
        var boxs = document.getElementsByClassName('cwb-repeat');
        if(boxs.length > 1){
            return true;
        } else{
            return false;
        }  
    },
    //通过素材选择情况来判断是否有时间添加
    checkTimeByFolder(){
        var times = ['time_list_on','time_list_off','time_list_full'];
        var files = ['file_list_on','file_list_off','file_list_full'];
        var messages = ['工作時間還未添加節目播放時間！','非工作時間還未添加節目播放時間！','全屏時間還未添加節目播放時間！'];

        var attr = {
            code: 0,
            message: '',
            onoff: true
        };
        var onoff = true;

        for(var i=0;i<files.length;i++){
            if(this.lget(files[i])&&this.lget(files[i]).length>=1){

                //检测是否有素材添加
                if(!this.lget(times[i]) || this.lget(times[i]).length==0){
                    attr.code = 400;
                    attr.message = messages[i];
                    onoff = true;
                    return attr;
                }else{
                    onoff = false;
                }
            }else{
                onoff = false;
            }
        }

        return false;
    },
    checkFolderByTimeLine(){
        var times = ['time_list_on','time_list_off','time_list_full'];
        var files = ['file_list_on','file_list_off','file_list_full'];
        var messages = ['工作時間還未添加節目播放素材！','非工作時間還未添加節目播放素材！','全屏時間還未添加節目播放素材！'];

        var attr = {
            code: 0,
            message: '',
            onoff: true
        };
        var onoff = true;

        for(var i=0;i<times.length;i++){
            if(this.lget(times[i])&&this.lget(times[i]).length>=1){

                //检测是否有素材添加
                if(!this.lget(files[i]) || this.lget(files[i]).length==0){
                    attr.code = 400;
                    attr.message = messages[i];
                    onoff = true;
                    return attr;
                }else{
                    onoff = false;
                }
            }else{
                onoff = false;
            }
        }

        return false;
    },
    //检测是否存在节目
    checkExistData(program){

        var rc = false;

        var m1 = program.model_type_1;
        var m2 = program.model_type_2;
        var m3 = program.model_type_3;

        if(m1.file_list.length > 0 && m1.time_list.length > 0){
            return true;
        }

        if(m2.file_list.length > 0 && m2.time_list.length > 0){
            return true;
        }

        if(m3.file_list.length > 0 && m3.time_list.length > 0){
            return true;
        }

        return false;
    },
    //去除字符串两边的空格
    strim(str,is_global)
    {
       var result;

        if(!str && str != 0){
         return false;
        }

       result = str.replace(/(^\s+)|(\s+$)/g,"");

       if(!result && result != 0){
         return false;
       }

       if(is_global.toLowerCase()=="g")
       {
         result = result.replace(/\s/g,"");
       }
       return result;
    },
    //格式化利率表数据
    tableFormat(data){
        for(var i=0;i<data.length;i++){
            data[i]['newDate'] = this.changeMonthFormat(data[i],data[i].date);
        }

        return data;
    },
    changeMonthFormat(dt,date){
        var d = {};
        var arr = date.split('-');
        var dstr = '';
        var months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
        var cm = 0;

        //计算当前是第几月
        for(var i=0;i<months.length;i++){
            if(months[i].toLowerCase() ==  arr[1].toLowerCase()){
                cm = i+1;
            }
        }

        d = {
            'date': '20'+arr[2]+'-'+this.addShiZoom(cm)+'-'+this.addShiZoom(arr[0]),
            'ndate': cm,
            'rate': dt['rate'],
            'nrate': dt['rate'].substr(0,dt['rate'].length-1),
            'cmt': '20'+arr[2]+this.addShiZoom(cm)
        };

        return d;
    },
    //表格显示的数据
    showtableFormat(arr){
        var narr = [];

        for(var i=0;i<arr.length;i++){
            narr.push(arr[i].newDate)
        }

        return narr;
    },
    addShiZoom(num){
        if(parseInt(num) >= 10){
            return ''+num
        }else{
            return '0'+num;
        }
    },
    //检测日期是否重复
    checkTimeRepeats(ct,ts){

        if(!ts){
            return true;
        }

        if(ts.length == 0){
            return false;
        }

        for(var i=0;i<ts.length;i++){
            if(ct == ts[i].date){
                return true;
            }
        }

        return false;
    },
    //检测利率格式
    checkRateFormat(rate){

        //去除百分号
        var str = '';
        var rate = rate+'';
        
        for(var i=0;i<rate.length;i++){
            if(rate.charAt(i) != '%'){
                str += rate.charAt(i);
            }
        }

        var re = /^[0-9]+\.?[0-9]*$/;
        var res = /^[0-9]+\.{1}[0-9]*$/;

       //没有匹配的 正确的数字格式 error
        if (!re.test(str)) {
            return true;
        }else{
            //判断是否有小数点
            if(res.test(str)){
                return str+'%';
            }else{
                return str;
            }
        }

        return false;
    },
    //格式化表格单条数据
    formatPerTableData(date,rate){
        var d = {
            'cmt': '201803',
            'date': '2018-03-01',
            'rate': '1.28%',
            'ndate': 3,
            'nrate': 1.28
        }
        
        //console.log(date,rate); //2018-05-23 12.32222%

         d['date'] = date;
         d['rate'] = rate;
         d['ndate'] = date.split('-')[1]>10?date.split('-')[1]:date.split('-')[1].toString().substr(1,1);
         d['nrate'] = rate.toString().substr(0,rate.toString().length-1);
         d['cmt'] = date.split('-')[0]+''+date.split('-')[1];
         
        return d;
    },
    //检测日期是否是当前或未来日期
    checkDateIsCurrent(dates){
        var date = new Date();
        var cyear = date.getFullYear();
        var cmonth = date.getMonth()+1;



        //比较年 以前年
        if(dates.split('-')[0] < cyear){
            return true;
        }

        //当年
        if(dates.split('-')[0] == cyear){
            //比较月
            if(dates.split('-')[1] < cmonth){
                return true;
            }
        }

        return false;
    },
    //检测表格中 excel 上传数据是否合法
    checkExcelDates(datas){
       
       //1.检测表格日期月份是否一致
       for(var i=0;i<datas.length;i++){
         for(var j=i+1;j<datas.length;j++){
            if(datas[i].cmt != datas[j].cmt){
                return {
                    'status': true,
                    'message': '格式錯誤！年月必須保持壹致 請仔細核對！'
                }   
            }
         }
       }

       //2.检测表格日期是否是当前或以后月份
       for(i=0;i<datas.length;i++){
          if(tool.checkDateIsCurrent(datas[i].date)){
             return {
                'status': true,
                'message': '格式錯誤！年月日期已經失效！'
            }  
          }
       }

       return {
            'status': false,
            'message': 'ok！'
        }  
    },
    //格式化利率信息
    formatJsonRate(datas){
        var cmt = datas[0].cmt;
        var key = 0;
        var showContent = {};

        for(var i=0;i<datas.length;i++){
            key = parseInt(datas[i].date.split('-')[2]);
            showContent[key] =  datas[i].nrate;
        }

        var obj = {
            'date': cmt,
            'dataSet': showContent
        };

        return {
            'monthNumber': cmt,
            'monthDataSet': JSON.stringify(obj)
        }
    },
    //获取当年当月的信息
    getcMonthNumber(){
        var date = new Date();
        var cyear = date.getFullYear();
        var cmonth = date.getMonth()+1;

        return cyear+''+(cmonth<10?'0'+cmonth:cmonth);
    },
    //格式化从服务器获取的表格数据
    formatServerTableData(data){

       var data = data.dataSet;

       var date = new Date();
       var cyear = date.getFullYear();
       var cmonth = date.getMonth()+1;
       var arr = [];

       var d = {
            'cmt': '201803',
            'date': '2018-03-01',
            'rate': '1.28%',
            'ndate': 3,
            'nrate': 1.28
        };
        
        d['cmt'] = cyear+''+(cmonth<10?'0'+cmonth:cmonth);
        d['ndate'] = cmonth;


        for(var day in data){
            d['date'] = cyear+'-'+(cmonth<10?'0'+cmonth:cmonth)+'-'+(day<10?'0'+day:day);
            d['rate'] = data[day]+ '%';
            d['nrate'] = data[day];

            arr.push({
                'cmt': d['cmt'],
                'date': d['date'],
                'rate': d['rate'],
                'ndate': d['ndate'],
                'nrate': d['nrate']
            });
        }

        return arr;
    },
    //检测表单提交是否合理
    submitIsRight(ipt){
        
        var data = ipt;
        var obj = {
            status: false,
            message: ''
        };

        //检测是否为空
        for(var key in data){
            if(!tool.strim(data[key],'g')){
                obj.status = true;
                obj.message = '表單內容不能空值!';
                return obj;
            }
        }

        return obj;
    },
    //检测设备
    etectmob() {  
        if( navigator.userAgent.match(/Android/i)  
        || navigator.userAgent.match(/webOS/i)  
        || navigator.userAgent.match(/iPhone/i)  
        || navigator.userAgent.match(/iPad/i)  
        || navigator.userAgent.match(/iPod/i)  
        || navigator.userAgent.match(/BlackBerry/i)  
        || navigator.userAgent.match(/Windows Phone/i)  
        ){  
            return true;  
        }  
        else {  
            return false;  
        }  
    },
    //获取并设置当前节目
    setCurrentProgram(data){
        console.log(data);
        //设置已选中素材
        this.lset('file_list_on',data[0][0]);
        this.lset('file_list_off',data[0][1]);
        this.lset('file_list_full',data[0][2]);

        //设置时间
        this.lset('time_list_on',data[1][0]);
        this.lset('time_list_off',data[1][1]);
        this.lset('time_list_full',data[1][2]);
    },
    //新版时间柱形图 格式化数据
    new_formatChartData(data){

         /*
            1. 需要格式： { start: "0", duration: "86400", weeks: "16", date: "fri", time: "00:00-24:00" }
            2. 目前的格式: { days: "Mon,Tue,wed",duration:1200,id:"RRwyYHJzPC",rects:[{…}],start::0,template:1,time:"00:00-00:20",weeks:56 }
        */

        let i = 0;
        let arr = [];

        for(;i<data.length;i++){
            arr.push({
                start: data[i].start,
                duration: data[i].duration,
                weeks: data[i].weeks,
                date: data[i].days,
                time: data[i].time,
                tid: data[i].id
            })
        }

        return arr;
    },
    //新版创建色块
    //创建颜色块
    new_createColorblock(pclsn,clsn,data){
        var color = '#f0b551'/*'rgb('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+')'*/;
        var p = document.getElementsByClassName(pclsn);
        
        for(var i=0;i<data.length;i++){
            for(var j=0;j<p.length;j++){
                //console.log(data[i][2].charAt(j))
                if(data[i][2].charAt(j)*1 == 1){
                    p[j].innerHTML += `<span class="cwb" style="display:block;width:100%;position:absolute;left:0;top:${data[i][0]}px;height:${data[i][1]}px;background-color:${color};"></span>`;
                }
            }
        }
    },
    // 通过素材id 获取图片 
    new_getPreviewImgById(arr,id){
        for(var i=0;i<arr.length;i++){
            if(arr[i].id == id){
                return arr[i].img;
            }
        }
    },
    //通过ID来确定切重新排列素材
    new_arrangeDataById(data,cid,lastid){
        var data = JSON.parse(JSON.stringify(data));
        var cindex = 0;
        var cdata = {};
        var lastIndex = 0;
        var lastdata = {};

        for(var i=0;i<data.length;i++){
            if(data[i].id == cid){
                cindex = i;
                cdata = {...data[i]};
                continue;
            }
            if(data[i].id == lastid){
                lastIndex = i;
                lastdata = {...data[i]};
                continue;
            }
        }

        if(cindex>lastIndex){
            data.splice(lastIndex,0,cdata);
            data.splice(cindex+1,1);
        }else{
            data.splice(lastIndex+1,0,cdata);
            data.splice(cindex,1);
        }

        return data;
    },
    new_arrangeChildren(children,ci,di){
        var cid = ci.dataset.id;
        var tid = di.dataset.id;

        var cindex = 0;
        var tindex = 0;

        var arr = [];
        var narr = [];

        for(var i=0;i<children.length;i++){
            arr.push(children[i]);
            ///narr.push(children[i]);
            if(children[i].dataset.id == cid){
                cindex = i;
                continue;
            }else if(children[i].dataset.id == tid){
                tindex = i;
                continue;
            }
        }


        for(var i=0;i<arr.length;i++){
            if(i == tindex){
                arr[i] = children[cindex];
            }
        }

        if(cindex > tindex){
            delete(arr[cindex]);
            arr.splice(tindex,0,children[cindex]);
        }else{
            arr.splice(tindex,0,children[cindex]);
            delete(arr[cindex]);
        }

        //console.log(arr);
        return arr;
        console.log(children);
    }
};

export default tool;