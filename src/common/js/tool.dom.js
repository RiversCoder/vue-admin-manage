
class ToolDom{
    constructor(){
        this.dragTimer = null;
    }

    /**
     * [drag 拖拽函数封装]
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    drag(opts)   //拖拽元素 并且生成 克隆元素
    {   
        var This = this;
        var obj = opts.target;
        var fns = opts.mouseup;
        var move = opts.mousemove;
        var parentWH = opts.parentWH;
        var mdown = opts.mousedown;

        var defaults = {
            parent: true,
            dragStart:function(x,y){},
            dragEnd:function(x,y){},
            dragMove:function(x,y){}
        };
        
        var opts = Object.assign(defaults,opts);

        obj.onmousedown = function(ev)
        {   
            //清除定时器
            cancelAnimationFrame(This.dragTimer);
            document.onmouseup = null;

            var ev = ev || window.event;
            var sx = ev.clientX;
            var sy = ev.clientY;
            var st = new Date();
            var sX = ev.clientX - this.getBoundingClientRect().left;
            var sY = ev.clientY - this.getBoundingClientRect().top;
            var ow = this.offsetWidth;
            var oh = this.offsetHeight;
            var parentWidth = obj.parentNode.getBoundingClientRect().width;
            var parentHeight = obj.parentNode.getBoundingClientRect().height;
            var disW = 0;
            var disH = 0;
            var onoff = false;
            var parentLeft = obj.parentNode.getBoundingClientRect().left;
            var parentTop = obj.parentNode.getBoundingClientRect().top;
            var eX = 0;
            var eY = 0;
            var passMoveOnff = false;

            //console.log(sX,sY,parentWidth,parentHeight)
            
            //设置目标元素的托拖拽属性
            obj.style.position = 'absolute';

            if(opts.parent){
                //obj.parentNode.style.position = 'relative';
                disW = obj.parentNode.clientWidth - ow;
                disH = obj.parentNode.clientHeight - oh;
                onoff = true;
            }

            //1.检测拖拽行为  2.获取鼠标抬起的位置
            var checkDisX = 0;
            var checkDisY = 0;

            var lastX = 0;
            var lastY = 0;

            //obj.style.left = 20 + 'px';
            var moveOnff = false;
            //console.log(obj.style.left,obj.style.top);

            mdown(ow/parentWidth,oh/parentHeight);

            document.onmousemove = function(ev)
            {   
                moveOnff = false;
                passMoveOnff = true;

                var ev = ev || window.event;

                eX = ev.clientX - parentLeft -  sX;
                eY = ev.clientY - parentTop -  sY;

                //设定X拖动范围
                if(eX < 0)
                {
                    eX = 0;
                }
                else if(eX > disW)
                {
                    eX = disW;
                }

                //设定Y拖动范围
                if(eY < 0)
                {
                    eY = 0;
                }
                else if(eY > disH)
                {
                    eY = disH;
                }

                obj.style.left = This.countPercent(eX / parentWidth);
                obj.style.top = This.countPercent(eY / parentHeight);

                lastX = eX;
                lastY = eY;

                move(eX / parentWidth,eY / parentHeight);
            };

            document.onmouseup = function(e)
            {   
                if(passMoveOnff){
                    fns(obj.dataset.id,lastX,lastY);
                }
                
                
                if(!moveOnff){
                    document.onmousemove=document.onmouseup = null;
                    return false;
                }

                //在鼠标松开后做匀减速运动
                //1. 计算当前的位置坐标
                var dt = (new Date() - st)/5;
                var ex = lastX;
                var ey = lastY;
                var dx = e.clientX - sx;
                var dy = e.clientY - sy;
                var speedX = dx/dt;
                var speedY = dy/dt;
                var timer = null;
               
                function fn(){

                    This.dragTimer = requestAnimationFrame(fn);

                    speedX *= 0.90;
                    speedY *= 0.90;

                    ex = ex + speedX;
                    ey = ey + speedY;

                    //边界检测
                    if(ex <= 0 || ex+ow >= parentWidth){
                        speedX = -speedX;
                    }
                    if(ey <= 0 || ey+oh >= parentHeight){
                        speedY = -speedY;
                    }

                    //停止检测
                    if(Math.abs(speedX) < 0.2 && Math.abs(speedY) < 0.2){
                        cancelAnimationFrame(This.dragTimer);
                        document.onmouseup = null;
                    }
                    
                    obj.style.left = ex + 'px';
                    obj.style.top = ey + 'px';
                }

                //fn();
                document.onmousemove=document.onmouseup = null;
                //document.onmousemove = null;
            };

            ev.cancelBubble = true;
            ev.stopPropagation();
            return false;
        };
        
    }


    /**
     * [dragZoom 拖拽放大缩小DIV]
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    
    dragZoomDOM(opts){
        var This = this;
        var obj = opts.target;
        var wrapper = opts.wrapper.get(0);
        var end = opts.end;
        var move = opts.mousemove;
        
        var pcls = opts.parentcls;

        obj.onmousedown = function(e){
            var parent = this.parentNode;
            var oW = parent.clientWidth;
            var oH = parent.clientHeight;
            var ratio = oH/oW;
            

            var sX = e.clientX;
            var sY = e.clientY;
            var cX = 0;
            var cY = 0; 
            var d = 0;
            var oldD = 0;
            var cHeight = 0, cWidth = 0;
            var cl = parent.getBoundingClientRect().left - wrapper.getBoundingClientRect().left;
            var ct = parent.getBoundingClientRect().top - wrapper.getBoundingClientRect().top;
            var wrapperWidth = wrapper.offsetWidth;
            var wraperHeight = wrapper.offsetHeight;
            var passMoveOnff = false;

            //mdown(oW/wrapperWidth,oH/wraperHeight);

            document.onmousemove = function(e){
                
                passMoveOnff = true;

                cX = e.clientX;
                cY = e.clientY;

                //计算 cos(45deg)
                d = cX - sX;

                oW = parent.clientWidth + (d-oldD);
                oH = oW * ratio;

                //console.log(parent.offsetWidth,oH,d-oldD,ratio);


                //检测边距
                cHeight = ct + oH;
                cWidth = cl + oW; 

                //console.log(cl,ct,cWidth,cHeight,wrapperWidth,wraperHeight);

                if(cWidth >= wrapperWidth || cHeight >= wraperHeight){
                    //cWidth = wrapperWidth;
                    return;
                    //oW = cWidth - cl;
                }

                parent.style.width = This.countPercent(oW/wrapperWidth);
                parent.style.height = This.countPercent(oH/wraperHeight);

                oldD = d;

                move(oW/wrapperWidth,oH/wraperHeight);
            }

            document.onmouseup = function(){
                if(passMoveOnff){
                    end(parent.dataset.id,oW/wrapperWidth,oH/wraperHeight);    
                }
                document.onmousemove = null;
                document.onmouseup = null;
            }

            e.preventDefault();
            e.cancelBubble = true;
            e.stopPropagation();
        }

    } 

    dragZoom(opts){

      var This = this;
      var obj = opts.target;
      var wrapper = opts.wrapper;
      var end = opts.end;
      var pcls = opts.parentcls;

      //pcls = '.'+pcls.split(' ')[1];
      //var parent = $(pcls);    /* opts.target.parent(pcls) */
    

      obj.on('mousedown',function(e){

        var parent = $(this).parent();
        var oW = parent.width();
        var oH = parent.height();
        var ratio = oH/oW;

        var sX = e.clientX;
        var sY = e.clientY;
        var cX = 0;
        var cY = 0; 
        var d = 0;
        var oldD = 0;
        var cHeight = 0, cWidth = 0;
        var cl = parent.offset().left - parent.parent().offset().left;
        var ct = parent.offset().top - parent.parent().offset().top;
        var wrapperWidth = wrapper.width();
        var wraperHeight = wrapper.height();

        $(document).on('mousemove',function(e){
            cX = e.clientX;
            cY = e.clientY;

            //计算 cos(45deg)
            d = cX - sX;

            oW = parent.width() + (d-oldD);
            oH = parent.height() + (d-oldD)*ratio;

            console.log(parent.width(),d-oldD);

            //检测边距
            cHeight = ct + oH;
            cWidth = cl + oW; 

            //console.log(cl,ct,cWidth,cHeight,wrapperWidth,wraperHeight);

            if(cWidth >= wrapperWidth || cHeight >= wraperHeight){
                //cWidth = wrapperWidth;
                return;
                //oW = cWidth - cl;
            }

            parent.css({
                width: This.countPercent(oW/wrapperWidth),
                height: This.countPercent(oH/wraperHeight)
            });

            oldD = d;
        });

        $(document).on('mouseup',function(e){

           end(parent.get(0).dataset.index,oW/wrapperWidth,oH/wraperHeight);

           $(document).off();
           $(document).off();
           obj.off('mousedown','**');     
        });

        e.preventDefault();
        e.cancelBubble = true;
        e.stopPropagation();
      });


    }

    /**
     * [ countPercent 将小数转换成百分数 / 保留几位小数 ]
     * @param  {[type]} num [description]
     * @return {[type]}     [description]
     */
    countPercent(num,len){
        
        var numStr = num + '';
        var newNum = 0;
        var newNumStr = '';

        var n = numStr.split('.')[0];
        var m = numStr.split('.')[1];

        if(len){
            return n+'.'+m.substr(0,len);
        }else{
            newNum = num * 100;

            newNum += '%';

                //console.log(newNumStr)

            return newNum;
        }

    }

}

export default new ToolDom();