import tool from '@/common/js/tool';
import toolDom from '@/common/js/tool.dom.js'

export default {

    init(){

    },


    //格式化时间列表
    formatTimeListData(svgs,svgBox,data){
        var rects = [];
        var newRects = [];
        var newRectsWrap = [];
        var newdatas = [];
        var data = JSON.parse(JSON.stringify(data));

        for(var i=0;i<data.length;i++){
            rects.push( [...JSON.parse(JSON.stringify(svgs.getRectsFromType(data[i].template)))] );
        }

        for(var i=0;i<rects.length;i++){
          
          newRects = [];
          for(var j=0;j<rects[i].length;j++){
            
            newRects.push({
              x: parseInt(rects[i][j].x * 1 * svgBox.w),
              y: parseInt(rects[i][j].y * 1 * svgBox.h),
              w: parseInt(rects[i][j].w * 1 * svgBox.w),
              h: parseInt(rects[i][j].h * 1 * svgBox.h),
              files: rects[i][j].files,
              type: 'model',
              size: rects[i][j].size,
              mid: rects[i][j].mid,
            });
            
          }

          newRectsWrap.push(newRects);
        }

        for(var i=0;i<data.length;i++){

            data[i].rects = [];

            newdatas.push(Object.assign(data[i],{'rects': newRectsWrap[i] }));
        }

        return newdatas;
    },


    //添加 timelists 数据
    addFormatTimeListData(svgs,timelists,times){
        var timelists = this.copy(timelists);
        var timeItem = Object.assign({ id:this.randomString(10) },times);
        var rects = svgs.getRectsFromType(1);

        timeItem = Object.assign(timeItem,{rects},{drags:[]});

        timelists.push(timeItem);

        return timelists;
    },

    formatTimeListPercentDataModel(svgs,timelists,id,type){
        
      var rects = svgs.getRectsFromType(type);
      var timelists = this.copy(timelists);

      for(var i=0;i<timelists.length;i++){
        if(timelists[i].id == id){
          timelists[i].template = type;
          timelists[i].rects = rects;
          break;
        }
      }

      return timelists;
    },

    formatGetNewdatas(timelists){
      var arr = JSON.parse(JSON.stringify(timelists));

      for(var i=0;i<arr.length;i++){
        delete arr['rects'];
      }

      return arr;
    },

    formatSelectDate({s,e,week}){
        /*
            {
                time: 'AM 08:15 -- PM 06:00',
                days: 'Mon Tue Thur Sat',
                template: 1 ,
                rects: []
            }
        */

        var t1 = tool.changeTimetoSecond(s);
        var t2 = tool.changeTimetoSecond(e) - t1;
        var w = tool.stringToHex(tool.changeWeek(week));
        
        return {
          'id': this.randomString(10),
          'time': s+'-'+e,
          'days': week.join(','),
          "start": t1,
          "duration": t2,
          "weeks":  w,
          "template": 1
        }
    },

    formatTemplateData(ctype,svgBox,temps){
      let rects = [];
      let newRects = [];
      let i = 0;

      //获取racts比例坐标宽高
      for(i=0;i<temps.length;i++){
        if(temps[i].type == ctype){
          rects = temps[i].rects;
          break;
        }
      }

      for(i=0;i<rects.length;i++){
        //console.log(toolDom.countPercent(rects[i].w))
        newRects.push({
          x: toolDom.countPercent(rects[i].x),
          y: toolDom.countPercent(rects[i].y) ,
          w: toolDom.countPercent(rects[i].w) ,
          h: toolDom.countPercent(rects[i].h),
          mid: rects[i].mid
        });
      }

      return newRects;
    },

     formatTemplateListData(svgs,svgBox,temps){
        var rects = [];
        var newRects = [];
        var newRectsWrap = [];
        var newdatas = [];

        rects = svgs.getAllRects();


        for(var i=0;i<rects.length;i++){
          
          newRects = [];
          for(var j=0;j<rects[i].length;j++){
            
            newRects.push({
              x: parseInt(rects[i][j].x * 1 * svgBox.w),
              y: parseInt(rects[i][j].y * 1 * svgBox.h),
              w: parseInt(rects[i][j].w * 1 * svgBox.w),
              h: parseInt(rects[i][j].h * 1 * svgBox.h)
            });
            
          }

          newRectsWrap.push(newRects);
        }
        
        for(var i=0;i<temps.length;i++){
          newdatas.push(Object.assign( {type:temps[i].type},{'rects': newRectsWrap[i] })); // 
        }

        return newdatas;
    },

    randomString(len) {
    　　var len = len || 32;
    　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    　　var maxPos = $chars.length;
    　　var pwd = '';
    　　for (var i = 0; i < len; i++) {
    　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    　　}
    　　return pwd;
    },

    //添加active样式
    addActiveClass(els,cid){
        els.each(function(){
            $(this).removeClass('bitemActive');
            if($(this).get(0).dataset.id == cid){
                $(this).addClass('bitemActive');
            }
        })
    },

    getCurrentRects(cid,lists){
      var arr = [];
      for(var i=0;i<lists.length;i++){
          if(lists[i].id == cid){
              arr = lists[i].rects;
              break;
          }
      }
      return arr;
    },

    deleteItemById(id,arr){
      var newArr = [];
      for(var i=0;i<arr.length;i++){
        if(arr[i].oid !== id){
          newArr.push(arr[i]);
        }
      }

      return newArr;
    },

    getNewDragDatas(arr,{id,w,h}){
      for(var i=0;i<arr.length;i++){
        if(arr[i].oid == id){
          arr[i].w = toolDom.countPercent(w);
          arr[i].h = toolDom.countPercent(h);
        }
      }
      return arr;
    },

    getNewDragDatasByPos(arr,{id,x,y,dwh}){

      for(var i=0;i<arr.length;i++){
        if(arr[i].oid == id){
          //console.log(x/dwh.w,y/dwh.h,toolDom.countPercent(x/dwh.w),toolDom.countPercent(y/dwh.h))
          arr[i]['l'] = toolDom.countPercent(x/dwh.w);
          arr[i]['t'] = toolDom.countPercent(y/dwh.h);
        }
      }
      return arr;
    },

    removeRepeat(arr){
      var nArr = arr;
      var mArr = [];
      var obj = {};


      for(var i=0;i<nArr.length;i++){
        var oid = nArr[i].oid;
        if(!obj[oid]){
          obj[oid] = true;
          mArr.push(nArr[i]);
        }
      }

      return mArr;

    },

    //获取当前rect位置下所有的资源files
    getFilesDataById(arr,id){

      var newArr = [];

      if(arr.length <=0 || id == -1){
        return [];
      }

      for(var i=0;i<arr.length;i++){
        for(var j=0;j<arr[i].rects.length;j++){
          if(arr[i].rects[j].mid == id){
            newArr = arr[i].rects[j].files;
            break;
          }
        }
      }

      return newArr;
    },

    //设置当前rect位置下所有的资源files
    setFilesDataById(arr,tid,id,newArr){

      var arr = JSON.parse(JSON.stringify(arr));
      var newArr = JSON.parse(JSON.stringify(newArr));

      //1. 首先确定时间列表项对象
      for(var i=0;i<arr.length;i++){
        if(arr[i].id == tid){
          for(var j=0;j<arr[i].rects.length;j++){
            if(arr[i].rects[j].mid == id){
              arr[i].rects[j].files = newArr;
              break;
            }
          }
          break;
        }
      }

      return arr;
    },

    getTempByTimeListId(arr,id){
      for(var i=0;i<arr.length;i++){
        if(arr[i].id == id){
          return arr[i].template;
        }
      }
    },

    cahngeTimeListType(arr,type){
      for(var i=0;i<arr.length;i++){
        arr
      }
    },
    //根据ID获取时间列表项的rects下的img集合 
    getRectsImgsByTid(timelists,cid){
      var tl = JSON.parse(JSON.stringify(timelists));
      var cid = cid + '';
      var arr = [];
      var imgs = [];

      if(tl.length <= 0 ){
        return [];
      }

      for(var i=0;i<tl.length;i++){
        if(tl[i].id == cid){
          arr = tl[i].rects;

          for(var j=0;j<arr.length;j++){
            if(arr[j].files.length > 0){
              imgs.push({'src':arr[j].files[0].img})
            }else{
              imgs.push({'src':''})
            }
          }

          break;
        }
      }

      return imgs;
    },
    //根据ID删除时间列表项
    deleteTimeListById(arr,id){
      var arr = JSON.parse(JSON.stringify(arr));
      var id = id;

      for(var i=0;i<arr.length;i++){
        if(arr[i].id == id){
          arr.splice(i,1);
          break;
        }
      }

      return arr;

    },
    copy(obj){
      return JSON.parse(JSON.stringify(obj));
    },
    formatDateTime(inputTime) {  
        var date = new Date(inputTime);
        var y = date.getFullYear();  
        var m = date.getMonth() + 1;  
        m = m < 10 ? ('0' + m) : m;  
        var d = date.getDate();  
        d = d < 10 ? ('0' + d) : d;  
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;  
        second = second < 10 ? ('0' + second) : second; 
        return y + '-' + m + '-' + d+'_'+h+':'+minute+':'+second;  
    },
    //格式化数据成要上线数据
    formatPublish(timelists,dragDatas,cid){
      var timelists = this.copy(timelists);
      var dragDatas = timelists.drags;

      //1. 先拼装timlist和drag数据
      // for(var i=0;i<timelists.length;i++){
      //   if(timelists[i].id == cid){
      //     timelists[i].drags = dragDatas;
      //     break;
      //   }
      // }

      //2. 格式化数据
      var content = [];
      var imgUrl = '';
      var imgUrlOnOff = true;

      var formatData = {
        preImg: './img/default.jpg',
        programID: new Date().getTime(),
        content: [],
        date: this.formatDateTime(new Date().getTime()),
        username: '',
        default_url_prefix: 'https://skylander-dbs.oss-cn-hongkong.aliyuncs.com',
        img_url: ''
      };

      

/*      var obj = {
        duration: 0,
        weeks:'',
        pro:[{
          x:0,y:0,w:0,h:0,type:'model',files:[{ file_id:0, file_type:0, file_duration:0 , file_size:0, times: 0, playType:0, url:'' }]
        }],
        start:0
      };
*/

      for(var i=0;i<timelists.length;i++){

        var c = { duration: timelists[i].duration, weeks: timelists[i].weeks, start: timelists[i].start, 'pro': [] };
        var d = timelists[i].drags;
        var r = timelists[i].rects;
        var a = [];
        var files = [];

        //可做拽插件元素
        for(var j=0;j<d.length;j++){
          var o = { x: this.ptp(d[j].l,3), y: this.ptp(d[j].t,3), w: this.ptp(d[j].w,3), h: this.ptp(d[j].h,3) , style: d[j].style, type: (d[j].contentType=='text'?'scrollText':d[j].type)};
          if(d[j].contentType=='text'){
            o['text'] = d[j].content;
          }
          a.push(o);
        }

        //模板位置元素
        for(var j=0;j<r.length;j++){
          var f = { x: r[j].x, y: r[j].y, w: r[j].w, h: r[j].h, type: 'model','files': []};
          var files = [];
          if(r[j].files.length == 0 ){
            continue;
          }
          for(var m=0;m<r[j].files.length;m++){
            if(imgUrlOnOff){
              imgUrl = r[j].files[m].img;
              imgUrlOnOff = false;
            }
            files.push({ "file_id":r[j].files[m].id, "file_type":r[j].files[m].file_type, "file_duration":r[j].files[m].file_duration, "file_size":r[j].files[m].file_size, "times":r[j].files[m].times, "playType":r[j].files[m].playType, "url":'/'+r[j].files[m].download_url.split('/')[r[j].files[m].download_url.split('/').length-1] });
          }
          f.files = files;
          a.push(f);
        }

        c.pro = this.copy(a);
        
        content.push(this.copy(c));
      }

      formatData.img_url = imgUrl;
      formatData.content = this.copy(content);

      return formatData;
    },
    //百分数转成小数
    ptp(str,len){
      var end = 0;
      var str = str + '';
      str = str.split('%')[0];
        
      end = this.rp(str,len);
      
      return end;
    },
    //保留几位小数
    rp(num,len=3){

      var num = (num/100) + '';
      var pointNum = '';
      var end = '';

      if(num.indexOf('.') === -1){
        for(var i=0;i<len;i++){
          pointNum += '0';
        }
        end = num + '.' + pointNum;
      }else{

        var interger = num.split('.')[0] + '';
        var point = num.split('.')[1] + '';
        var newPoint = '';

        if(point.length < len){

          var dis = len - point.length;
          var fill = arr.fill('0',dis);

          newPoint = point + fill.join('');

        }else{

          newPoint = point.substr(0,len);
          //console.log(newPoint);        
        }

        end = interger + '.' + newPoint;
      }  

      return end;
    },
    //添加drags到timeList里面
    addTimeListDrags(timelists,tid,drags){
      var timelists = this.copy(timelists);
      var drags = this.copy(drags);

      for(var i=0;i<timelists.length;i++){
        if(timelists[i].id == tid){
          timelists[i].drags = drags;
          break;
        }
      }

      return timelists;

    },
    //获取到timelist里面的drags
    getAllDragBoxData(timelists,tid){
      var timelists = this.copy(timelists);
      var drags = [];

      for(var i=0;i<timelists.length;i++){
        if(timelists[i].id == tid){
          drags = timelists[i].drags;
          break;
        }
      }

      return drags;
    },
    //删除当前时间列表的插件
    deleteAllDragBoxData(timelists,tid){
      var timelists = this.copy(timelists);

      for(var i=0;i<timelists.length;i++){
        if(timelists[i].id == tid){
          timelists[i].drags = [];
          for(var j=0;j<timelists[i].rects.length;j++){
            timelists[i].rects[j].files = [];
          }
          break;
        }
      }

      return timelists;
    },
    //添加转场效果相关字段
    addEffectPage(sources){
      var sources = this.copy(sources);

      for(var i=0;i<sources.length;i++){
        sources[i] = this.copy({...sources[i],times:0,playType:0});
      }

      return sources;
    },
    //更改当前拖拽的专场的数据
    getNewSourceDataById(data,id,type){
      var data = this.copy(data);

      for(var i=0;i<data.length;i++){
        if(data[i].id == id){
          data[i].playType = type;
          break;
        }
      }

      return data;

    }
}