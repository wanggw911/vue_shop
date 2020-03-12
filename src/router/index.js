import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'

Vue.use(VueRouter)

const routes = [
  {  path: '/', redirect: '/login' },
  // {  path: '/', redirect: '/home' },
  {  path: '/login', component: Login },
  // welcome 需要在 home 页面显示，所以需要设置一下自路由的形式来设置path
  {  path: '/home', 
     component: Home, 
     redirect: '/welcome', 
     children: [
      { path: '/welcome',  component: Welcome },
      { path: '/users',  component: Users },
      { path: '/rights',  component: Rights },
      { path: '/roles',  component: Roles },
      { path: '/categories',  component: Cate },
      
  ] },
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()

  // const token = window.sessionStorage.getItem('token')
  // if (!token) return next('/login')

  next()
})

export default router
