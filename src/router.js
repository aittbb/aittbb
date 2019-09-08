import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routers: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/Home', component: Home }
  ]
})