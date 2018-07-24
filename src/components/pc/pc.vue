<template>
    <div class="program-control-wrapper" >
        
        <router-view></router-view>
        
    </div>
</template>


<script scoped>

    export default {
        data(){
            return {
                
            }
        },
        methods:{
            
        },
        created(){
            
        },
        mounted(){

        }
    }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
    
    .program-control-wrapper
        @extend .rp;wh(100%,auto);

</style>