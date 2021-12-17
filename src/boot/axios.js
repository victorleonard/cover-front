import Vue from 'vue'
import axios from 'axios'
import { Cookies, LocalStorage } from 'quasar'

Vue.mixin({
  beforeCreate () {
    const options = this.$options
    if (options.axios) {
      this.$axios = options.axios
    } else if (options.parent) {
      this.$axios = options.parent.$axios
    }
  }
})

export default function ({ app, store, ssrContext }) {
  let apiUrl = 'https://cover-mobile.herokuapp.com/'
  if (process.env.DEV) apiUrl = 'http://localhost:1337/api'
  const instance = axios.create({
    baseURL: apiUrl
  })
  const cookies = process.env.SERVER
    ? Cookies.parseSSR(ssrContext)
    : Cookies
  instance.interceptors.request.use(config => {
    let token
    if (process.env.MODE === 'ssr') {
      token = cookies.get('token')
    } else {
      token = LocalStorage.getItem('token')
    }
    if (token) {
      config.headers.Authorization = `bearer ${token}`
    }
    return config
  }, error => {
    return Promise.reject(error)
  })

  app.axios = instance
  store.$axios = instance
}
