import Vue from 'vue'
import VueRouter from 'vue-router'
// import ElementUI from 'element-ui';

import store from '@/store'

const Layout = resolve => require(['@/views/layout/Layout.vue'], resolve)

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        meta: { title: '控制面板' },
        component: () => import('@/views/MainView.vue' /* webpackChunkName: 'main' */)
      },
    ]
  },
  {
    path: '/sign',
    meta: { title: '登陆', auth: false },
    component: () => import('@/views/user/SignView.vue' /* webpackChunkName: 'sign' */)
  },
  {
    path: '/lost-password',
    meta: { title: '忘记密码', auth: false },
    component: () => import('@/views/user/LostPasswordView.vue' /* webpackChunkName: 'lost-password' */)
  },
  {
    path: '*',
    meta: { auth: false },
    component: resolve => require(['@/views/NotFound.vue'], resolve)
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL || __dirname,
  routes
})

// let loadingInstance

router.beforeEach(({meta, path}, from, next) => {
  // loadingInstance = ElementUI.Loading.service({ fullscreen: true });

  if (meta.title) document.title = meta.title

  let { auth = true } = meta
  let is_signin = store.getters.is_sign
  
  if (is_signin && path === '/sign') return next({ path: '/' })
  if (auth && !is_signin && path !== '/sign') return next()
  if (auth && !is_signin && path !== '/sign') return next({ path: `/sign?redirect=${path}` })

  next()
})

router.afterEach(() => {
  // loadingInstance.close()
})

export default router