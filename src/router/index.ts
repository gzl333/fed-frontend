import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import store from '@/store'

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
      title: '注册-中国科技云联邦 ',
      redirectLogged: true
    }
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import(/* webpackChunkName: "Main" */ '@/views/Main.vue'),
    meta: {
      title: '首页-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/usage',
    name: 'Usage',
    component: () => import(/* webpackChunkName: "Usage" */ '@/views/Usage.vue'),
    meta: {
      title: '在用资源-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/group',
    name: 'Group',
    component: () => import(/* webpackChunkName: "Group" */ '@/views/Group.vue'),
    meta: {
      title: '我的小组-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/bill',
    name: 'Bill',
    component: () => import(/* webpackChunkName: "Bill" */ '@/views/Bill.vue'),
    meta: {
      title: '计费中心-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/ticket',
    name: 'Ticket',
    component: () => import(/* webpackChunkName: "Ticket" */ '@/views/Ticket.vue'),
    meta: {
      title: '工单中心-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/manage',
    name: 'Manage',
    component: () => import(/* webpackChunkName: "Manage" */ '@/views/Manage.vue'),
    meta: {
      title: '资源管理-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component: () => import(/* webpackChunkName: "Monitor" */ '@/views/Monitor.vue'),
    meta: {
      title: '监测中心-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import(/* webpackChunkName: "Users" */ '@/views/Users.vue'),
    meta: {
      title: '用户管理-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/data',
    name: 'Data',
    component: () => import(/* webpackChunkName: "Data" */ '@/views/Data.vue'),
    meta: {
      title: '数据中心-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import(/* webpackChunkName: "Maintenance" */ '@/views/Maintenance.vue'),
    meta: {
      title: '联邦维护-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import(/* webpackChunkName: "Statistics" */ '@/views/Statistics.vue'),
    meta: {
      title: '统计报表-中国科技云联邦',
      requireLogin: true
    }
  },
  {
    path: '/provide',
    name: 'Provide',
    component: () => import(/* webpackChunkName: "Provide" */ '@/views/Provide.vue'),
    meta: {
      title: '已供资源-中国科技云联邦',
      requireLogin: true
    }
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // if not logged in yet, jump to login page
  if (to.meta.requireLogin && !store.state.user.isLogin) {
    next({ name: 'Login' })
  }
  // if logged in, jump to the page before login or Home view
  if (to.meta.redirectLogged && store.state.user.isLogin) {
    const routername = from.name
    next({ name: routername || 'Main' })
  }
  // change page title with each jump
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
