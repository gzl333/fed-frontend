import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '中国科技云联邦'
    }
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login.vue'),
    meta: {
      title: '中国科技云联邦 - 注册'
    }
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import(/* webpackChunkName: "Main" */ '@/views/Main.vue'),
    meta: {
      title: '中国科技云联邦 - 首页'
    }
  },
  {
    path: '/usage',
    name: 'Usage',
    component: () => import(/* webpackChunkName: "Usage" */ '@/views/Usage.vue'),
    meta: {
      title: '中国科技云联邦 - 在用资源'
    }
  },
  {
    path: '/group',
    name: 'Group',
    component: () => import(/* webpackChunkName: "Group" */ '@/views/Group.vue')
  },
  {
    path: '/bill',
    name: 'Bill',
    component: () => import(/* webpackChunkName: "Bill" */ '@/views/Bill.vue')
  },
  {
    path: '/ticket',
    name: 'Ticket',
    component: () => import(/* webpackChunkName: "Ticket" */ '@/views/Ticket.vue')
  },
  {
    path: '/manage',
    name: 'Manage',
    component: () => import(/* webpackChunkName: "Manage" */ '@/views/Manage.vue')
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component: () => import(/* webpackChunkName: "Monitor" */ '@/views/Monitor.vue')
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import(/* webpackChunkName: "Users" */ '@/views/Users.vue')
  },
  {
    path: '/data',
    name: 'Data',
    component: () => import(/* webpackChunkName: "Data" */ '@/views/Data.vue')
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import(/* webpackChunkName: "Maintenance" */ '@/views/Maintenance.vue')
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import(/* webpackChunkName: "Statistics" */ '@/views/Statistics.vue')
  },
  {
    path: '/provide',
    name: 'Provide',
    component: () => import(/* webpackChunkName: "Provide" */ '@/views/Provide.vue')
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
