<template>
    <div class="admin-menu-home">
        <div class="company-info">
            <img src="./logo@250x250.png" class="c-logo" />
        </div>
    </div>
</template>


<script>
    
    //import store from '../../store/index'
    import {mapGetters, mapMutations, mapActions} from 'vuex';

    //console.log(store.state.token);
    //console.log(store.state.token)
    export default{
        computed:{
            ...mapGetters([
                'token'
            ])
        },
        created(){
            
        }
    }
</script>


<style scoped lang='stylus' rel='stylesheet/stylus'>
    
    @import "~common/stylus/variable" 
    @import "~common/stylus/mixin"
    
    .admin-menu-home
        width:100%;height:100%;
    .company-info
        position:asbolute;width:100%;height:100%;ab(0,0);
        .c-logo
            width:38%;ab(50%,50%);transform:translate3d(-50%,-50%,0);-webkit-transform:translate3d(-50%,-50%,0);-moz-transform:translate3d(-50%,-50%,0);-ms-transform:translate3d(-50%,-50%,0);-o-transform:translate3d(-50%,-50%,0);
</style>