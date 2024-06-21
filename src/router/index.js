// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../components/HomePage.vue'
import AboutPage from '../components/AboutPage.vue'
import AdministrativeRegion from '../components/AdministrativeRegion.vue'
import AdministrativeRegion_province from '../components/AdministrativeRegion_province.vue'
// 其他页面组件

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/about',
    name: 'AboutPage',
    component: AboutPage
  },
  {
    path: '/AdministrativeRegion',
    name: 'AdministrativeRegion',
    component: AdministrativeRegion
  },
  {
    path: '/AdministrativeRegion_province',
    name: 'AdministrativeRegion_province',
    component: AdministrativeRegion_province
  },
  // 可以继续添加其他路由
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router