// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import Util from '@/assets/js/util'
import App from './App'
import router from './router'
import utilTools from './router/utilTools'

import 'element-ui/lib/theme-default/index.css'
import '@/assets/css/main'
Vue.use(ElementUI);
Vue.use(Util);
Vue.use(utilTools);


Vue.config.productionTip = false
    // router.beforeEach((to, from, next) => {
    //         // 判断该路由是否需要登录权限
    //         if (!to.meta.requireAuth) {
    //             // 通过vuex state获取当前的token是否存在
    //             console.log(sessionStorage.getItem("accesstoken"));
    //             if (sessionStorage.getItem("accesstoken")) {
    //                 next();
    //             } else {
    //                 next({
    //                     path: '/login',
    //                     query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
    //                 })
    //             }
    //         } else {
    //             next();
    //         }
    //     })
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})