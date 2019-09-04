import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Task from '@/views/Task'
import Login from '@/views/Login'
import Error from '@/views/components/Error'

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        }, {
            path: '/task/:id',
            name: 'task',
            component: Task,
        }, {
            path: '/login',
            name: 'login',
            component: Login,
        }, {
            path: '/error',
            name: 'error',
            component: Error,
        }
    ]
});
const LOGIN_PAGE_NAME = 'login';
const HOME_PAGE_NAME = 'home';
const ERROR_PAGE_NAME = 'error';

//判断是否微信浏览器打开
function isWechat() {
    return /MicroMessenger/i.test(navigator.userAgent)
}
//判断是否QQ打开 MQQBrowser
function isQQ(){
    return / QQ/i.test(navigator.userAgent)
}
function isAli(){
    return / Alipay/i.test(navigator.userAgent)
}
router.beforeEach((to, from, next) => {
    if(to.query.qlx_trackid) localStorage.setItem('trackId', to.query.qlx_trackid);
    if ((isWechat() || isQQ() || isAli()) && to.name !== ERROR_PAGE_NAME) {
        next({
            name: ERROR_PAGE_NAME, // 跳转到错误页
            query: {qlx_trackid: to.query.qlx_trackid || ""}
        })
    } else if (!isWechat() && !isQQ() && !isAli() && to.name === ERROR_PAGE_NAME) {
        next({
            name: HOME_PAGE_NAME,
            query: {qlx_trackid: to.query.qlx_trackid || ""}
        })
    } else {
        const is_login = localStorage.getItem('sessionId')
        if (!is_login && to.name === LOGIN_PAGE_NAME) {
            // 没登录跳转到首页
            next({
                name: HOME_PAGE_NAME,
                query: {qlx_trackid: to.query.qlx_trackid || ""}
            })
        }else{
            next({query: {qlx_trackid: to.query.qlx_trackid || ""}})
        }
    }
});

// 路由跳转后的钩子
router.afterEach(to => {
    window.scrollTo(0, 0);
});

export default router