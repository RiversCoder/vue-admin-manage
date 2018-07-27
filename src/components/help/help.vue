<template>
    <div class="help" ref="menuScroll">
        <div class="logoBox">
            <img src="./logo@250x250.png" class="logoImg" />
            <h3 class="logoTitle">support@skylandertech.com</h3>
             <h4 class="ab-website">info@skylandertech.com</h4>
        </div>

        <div class="areaBox" ref="areaBox">
            <a class="logoSite" href="http://www.skylandertech.com" target="_blank">www.skylandertech.com</a>
            <p class="ab-area">深圳市龙岗区五和大道星河WORLD-A 1303A</p>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{

            }
        },
        methods:{
            setAreaBox(){
                var box = this.$refs.areaBox;
            },
            initWrapHeight(){
                var ms = this.$refs.menuScroll;
                var box = this.$refs.areaBox;
                //var hf = this.$refs.headerFile;
                var hh = document.body.offsetHeight;
                var hf_height = 0;
                ms.style.overflow = 'hidden';
                

                function fn(){
                    hh = document.body.offsetHeight;
                    ms.style.height = hh - hf_height + 'px';
                    //console.log(document.body.clientHeight,hf_height)
                    box.style.top = (document.body.clientHeight - box.offsetHeight - 160) + 'px';
                    if(document.body.clientHeight<680){
                        box.style.top = (document.body.clientHeight - box.offsetHeight - 30) + 'px';
                    }

                    if(document.body.clientWidth<380){
                        box.style.top = (document.body.clientHeight - box.offsetHeight - 80) + 'px';
                    }
                    
                }

                fn();

                window.addEventListener('resize',fn);
            }
        },
        mounted(){
            this.initWrapHeight();
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
    .help
        width:100%;height:1080px;position:relative;

    .logoBox
        text-align:center;padding-top:112px;
        .logoImg
            wh(250px,250px);border-radius:10px;
            
        .logoTitle
            hh(26px);padding-top:8px;font-size:16px;color:#333;
        
        .ab-website
            hh(26px);padding-top:5px;font-size:16px;color:#333;
            
    .areaBox
        width:100%;height:72px;text-align:center;position:absolute;bottom:280px;  
        
        .logoSite
            text-decoration:none;hh(17px);padding-top:13px;font-size:17px;color:#3F80E1;
            &:hover
                text-decoration:underline;  
    
       
        .ab-area
            hh(17px);font-size:17px;color:#999;padding-top:27px;  
    
    @media screen and (max-width:500px)
        .logoBox
            .logoTitle
                font-size:14px;
            .ab-website
                font-size:14px;    
            
        .help
            height:100%;
           .areaBox
              top:500px; 
              .logoSite
                font-size:14px;
              .ab-area
                font-size:14px;padding-top:17px;     
                      
    @media screen and (max-width:350px)
        .logoBox
            padding-top:30px;
        .help
          .areaBox
            top:400px;
</style>