import Vue from 'vue'
import VueRouter from 'vue-router'

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

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  const publicRouter = ['connect', 'register']

  Router.afterEach((to, from) => {
    if (!publicRouter.find(el => el === to.name)) {
      if (
        localStorage.getItem('userId') &&
        localStorage.getItem('token') &&
        localStorage.getItem('userEmail')
      ) {
        console.log('ok all localstorage !!!!!!!!!!!!!!!!!!!')
      } else {
        Router.push({
          name: 'connect'
        })
      }
    }
  })

  return Router
}
