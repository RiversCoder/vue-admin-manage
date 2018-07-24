import tool from '@/common/js/tool';

export default {

    init(){

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