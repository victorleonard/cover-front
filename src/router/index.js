import Vue from 'vue'
import VueRouter from 'vue-router'
import { Cookies } from 'quasar'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({ store, ssrContext }) {
  const cookies = process.env.SERVER
    ? Cookies.parseSSR(ssrContext)
    : Cookies // otherwise we're on client
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  const publicRouter = ['welcome', 'connect', 'register', 'email-confirmation', 'reset-password', 'forgot-password']

  Router.afterEach((to, from) => {
    if (!publicRouter.find(el => el === to.name)) {
      if (!cookies.has('token')) {
        Router.push({
          name: 'connect'
        })
      }
    }
  })

  return Router
}
