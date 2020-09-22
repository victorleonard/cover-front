import Api from './Api.js'

export default {
  getSongs () {
    return Api().get('/selection')
  }
}
