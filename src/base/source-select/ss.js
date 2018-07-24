import tool from '@/common/js/tool';

export default {

    init(){

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
        newRects.push({
          x: parseInt(rects[i].x * 1 * svgBox.w),
          y: parseInt(rects[i].y * 1 * svgBox.h),
          w: parseInt(rects[i].w * 1 * svgBox.w),
          h: parseInt(rects[i].h * 1 * svgBox.h)
        });
      }

      return newRects;

    }
}