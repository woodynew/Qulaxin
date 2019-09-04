import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vue2-toast/lib/toast.css';
import Toast from 'vue2-toast';
import VueAwesomeSwiper from 'vue-awesome-swiper'

// 引用API文件
import api from './api.js'
import FastClick from 'fastclick'
import 'amfe-flexible'

// require swiper styles
import 'swiper/dist/css/swiper.css'

import './registerServiceWorker'
Vue.use(VueAwesomeSwiper, /* { default global options } */)
Vue.use(Toast, {
    type: 'center',
    duration: 2000,
    wordWrap: true,
    width: 'auto'
});
// 将API方法绑定到全局
Vue.prototype.$api = api
window.addEventListener('load', () => {
    FastClick.prototype.focus = (targetElement) => {
        console.log(targetElement);
        let length;
        if (targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
            length = targetElement.value.length;
            targetElement.focus();
            targetElement.setSelectionRange(length, length);
        } else {   
            targetElement.focus();
        }
    }
});
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
