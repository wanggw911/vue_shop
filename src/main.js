import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css' 
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入网络请求的库
import axios from 'axios'


// 配置请求的根路径
axios.defaults.baseURL = 'http://'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 关联Vue属性
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
