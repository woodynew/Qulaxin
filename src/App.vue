<template>
    <div id="app">
        <transition name="fade">
            <router-view></router-view>
        </transition>
        <loading v-if="isLoading" :message="loadingMsg"></loading>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import loading from './views/components/Loading'

    export default {
        name: 'App',
        components: {loading},
        computed: {
            ...mapState({
                isLoading: state => state.isLoading,
                loadingMsg: state => state.loadingMsg
            })
        },
        created() {

        }
    }
</script>

<style>
    @font-face{
        font-family: 'HYZhuZiMeiXinTiW';
        src: url('assets/fonts/HYZhuZiMeiXinTiW-Regular.ttf');
    }
    @font-face {
        font-family: 'DIN Alternate Bold';
        src: url('assets/fonts/DIN Alternate Bold.ttf');
    }
    img{content: normal !important;}
</style>
