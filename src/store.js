import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLoading: false,
        loadingMsg: '数据加载中',
    },
    mutations: {
        // 控制loading显示隐藏
        LoadingStatus(state, payload) {
            state.isLoading = payload.isLoading;
            state.loadingMsg = payload.loadingMsg
        }
    },
    getters: {},
    actions: {}
})
