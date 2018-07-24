export const templates = [
    {
        type: 1,
        stroke: '#c9c9c9',
        rects: [ { x:0,y:0,w:1,h:1,files:[],type:'model',size:'1600 x 900',mid:'1-1'} ]

    },
    {
        type: 2,
        stroke: '#c9c9c9',
        rects: [ { x:0,y:0,w:0.5,h:0.5,files:[],type:'model',size:'800 x 450',mid:'2-1'}, { x:0.5,y:0,w:0.5,h:0.5,files:[],type:'model',size:'800 x 450',mid:'2-2'}, { x:0,y:0.5,w:0.5,h:0.5,files:[],type:'model',size:'800 x 450',mid:'2-3'}, { x:0.5,y:0.5,w:0.5,h:0.5,files:[],type:'model',size:'800 x 450',mid:'2-4'}]
    },
    {
        type: 3,
        stroke: '#c99cc9',
        rects: [ { x:0,y:0,w:0.3,h:0.3,files:[],type:'model',size:'480 x 270',mid:'3-1'}, { x:0.3,y:0,w:0.7,h:0.3,files:[],type:'model',size:'1120 x 270',mid:'3-2'}, { x:0,y:0.3,w:1,h:0.7,files:[],type:'model',size:'1600 x 630',mid:'3-3'}]
    },
    {
        type: 4,
        stroke: '#c9c9c9',
        rects: [ { x:0,y:0,w:0.4,h:0.4,files:[],type:'model',size:'640 x 360',mid:'4-1'}, { x:0,y:0.4,w:0.4,h:0.6,files:[],type:'model',size:'640 x 540',mid:'4-2'}, { x:0.4,y:0,w:0.6,h:1,files:[],type:'model',size:'960 x 900',mid:'4-3'}]
    }
];

class SvgClass{
    constructor(){
        this.datas = templates;
    }

    getRectsFromType(type){

        for(var i=0;i<this.datas.length;i++){
            if(this.datas[i].type == type){
                return this.datas[i].rects;
            }
        }

        return [];
    }

    getAllRects(){
        var ndata = [];

        for(var i=0;i<this.datas.length;i++){
            ndata.push(this.datas[i].rects);
        }
        return ndata;
    }
}

export default new SvgClass();