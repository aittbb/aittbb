import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(ElementUI)
// 关联vue和axios
Vue.prototype.$axios = axios
Vue.config.productionTip = false
// 设置axios的默认值.
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 发送请求之前做什么.
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 每次发送请求前添加最新的token
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 当axios成功后获取到的响应体的处理   配置axios的响应拦截器
axios.interceptors.response.use(function (res) {
  // console.log('res', res)
  return res.data
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
