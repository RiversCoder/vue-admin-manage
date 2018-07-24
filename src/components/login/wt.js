const wt = {
    getData(){
        const datas = {"date":"2018-05-12 21:31:24","img_url":"https://skylander-dbs.oss-cn-hongkong.aliyuncs.com/user-dir/iwm4DHHyxcQ2.jpg?x-oss-process=image/resize,h_100","username":"tangjianhhh@gmail.com","program":{"model_type_1":{"file_list":[{"file_id":500,"file_type":0,"download_url":"/user-dir/ERAzhzdze8Yy.jpg","file_size":2338363,"file_duration":15},{"file_id":497,"file_type":1,"download_url":"/user-dir/CmfEDeFymdiE.mp4","file_size":17684487,"file_duration":113},{"file_id":499,"file_type":0,"download_url":"/user-dir/iwm4DHHyxcQ2.jpg","file_size":122326,"file_duration":15},{"file_id":496,"file_type":1,"download_url":"/user-dir/a62yYbEBxjKn.mp4","file_size":17681402,"file_duration":67}],"time_list":[{"start":0,"duration":15300,"weeks":112}]},"model_type_2":{"file_list":[{"file_id":497,"file_type":1,"download_url":"/user-dir/CmfEDeFymdiE.mp4","file_size":17684487,"file_duration":113},{"file_id":500,"file_type":0,"download_url":"/user-dir/ERAzhzdze8Yy.jpg","file_size":2338363,"file_duration":15}],"time_list":[{"start":900,"duration":17100,"weeks":12}]},"model_type_3":{"file_list":[{"file_id":499,"file_type":0,"download_url":"/user-dir/iwm4DHHyxcQ2.jpg","file_size":122326,"file_duration":15}],"time_list":[{"start":0,"duration":13500,"weeks":1}]}},"url_prefix":"https://skylander-dbs.oss-cn-hongkong.aliyuncs.com"};
        return datas;
    },
    formatData(datas){
        var file_list_on = [];
        var file_list_off = [];
        var file_list_full = [];
        var time_list_on = [];
        var time_list_off = [];
        var time_list_full = [];

        var prefix = datas.url_prefix;
        var c = datas.program;
        var files = [];
        var times = [];

        file_list_on = c.model_type_1.file_list;
        time_list_on = c.model_type_1.time_list;
        file_list_off = c.model_type_2.file_list;
        time_list_off = c.model_type_2.time_list;
        file_list_full = c.model_type_3.file_list;
        time_list_full = c.model_type_3.time_list;

        files = [file_list_on,file_list_off,file_list_full];
        times = [time_list_on,time_list_off,time_list_full];


        for(var i=0;i<files.length;i++){

            if(files[i].length == 0){
                continue;
            }

            for(var j=0;j<files[i].length;j++){
                files[i][j]['id'] = files[i][j]['file_id'];
                files[i][j]['download_url'] = prefix + files[i][j]['download_url'];
                files[i][j]['file_name'] = this.spl(files[i][j]['download_url'],'/');
                if(files[i][j]['file_type'] == 0){
                    files[i][j]['img'] = files[i][j]['download_url']+'?x-oss-process=image/resize,h_100';
                }
                if(files[i][j]['file_type'] == 1){
                    files[i][j]['img'] = files[i][j]['download_url']+'?x-oss-process=video/snapshot,t_3000,f_jpg,w_800,h_600,m_fast';
                }
            }
        }

        for(var i=0;i<times.length;i++){

            if(times[i].length == 0){
                continue;
            }

            for(var j=0;j<times[i].length;j++){
                times[i][j]['date'] = this.timeformat(times[i][j]).date;
                times[i][j]['time'] = this.timeformat(times[i][j]).time;
            }
        }

        
        return [files,times];

    },
    spl(str,sp){
        var arr = str.split(sp);
        var last = arr[arr.length-1];
        return last;
    },
    timeformat(times){
        var attr = {
            date: '',
            time: ''
        };

        //计算时间
        attr['time'] = this.fdt(times.start*1) + '-' + this.fdt(times.start*1+times.duration*1);
        attr['date'] = this.fw(times.weeks*1);
        
        return attr;
    },
    fdt(seconds){
        var h = Math.floor(seconds*1/60/60);
        var e = (seconds - h*60*60)/60;
        var str = this.addZoom(h) + ':' + this.addZoom(e);

        return str;
    },
    addZoom(num){
        if(num*1 >= 10){
            return num;
        }else{
            return '0'+num;
        }
    },
    fw(weeks){
        //转换成十进制
        //console.log()
       //var weekIndex = {'sun':0,'mon':1,'tue':2, 'wed': 3, 'thu': 4, 'fri':5, 'sat': 6};
       var w = ['sun','mon','tue','wed','thu','fri','sat'];
       var str = this.addZoomBefore(weeks.toString(2),7);
       var wa = [];

       for(var i=0;i<str.length;i++){
         if(str.charAt(i) == 1){
            wa.push(w[i]);
         }
       } 

       return wa.join(',');
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

    }
};

export default wt;