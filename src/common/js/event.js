var event = {
    init: function(){
        if(!this.events){
         this.events = [];   
        }
    },
    addResize: function(fn){
        if(this.events && this.events.length>1){
            for(var i=0;i<this.events.length;i++){
                if(this.events[i] == fn){
                    this.events.splice(i,1);
                }
            }
            this.events.push(fn);
        }
    },
    resize: function(fn){
        window.addEventListener('resize',fn,false);
    }
};

export default event;