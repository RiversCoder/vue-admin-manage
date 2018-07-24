import tool from '@/common/js/tool';

export default {

    init(){

    },

    formatTimeListData(svgs,svgBox,data){
        var rects = [];
        var newRects = [];
        var newRectsWrap = [];
        var newdatas = [];

        for(var i=0;i<data.length;i++){
             rects.push([...svgs.getRectsFromType(data[i].template)]);
        }


        for(var i=0;i<rects.length;i++){
          
          newRects = [];
          for(var j=0;j<rects[i].length;j++){
            
            newRects.push({
              x: parseInt(rects[i][j].x * 1 * svgBox.w),
              y: parseInt(rects[i][j].y * 1 * svgBox.h),
              w: parseInt(rects[i][j].w * 1 * svgBox.w),
              h: parseInt(rects[i][j].h * 1 * svgBox.h),
              files: [],
              type: 'model',
              size: rects[i][j].size,
              mid: rects[i][j].mid,
            });
            
          }

          newRectsWrap.push(newRects);
        }
        
        for(var i=0;i<data.length;i++){
             newdatas.push(Object.assign(data[i],{'rects': newRectsWrap[i] }));
        }

        return newdatas;
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
    }
}