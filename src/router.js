import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Categories from './components/Categories.vue'
import Users from './components/Users.vue'
import Goods from './components/Goods.vue'
import GoodsAdd from './components/GoodsAdd.vue'
import Rights from './components/Rights.vue'
import Roles from './components/Roles.vue'
import Params from './components/Params.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Categories },
        { path: '/goods', component: Goods },
        { path: '/goods-add', component: GoodsAdd },
        { path: '/params', component: Params }
      ]

    }
  ]
})

// 路由守卫.判断是否有token,
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
