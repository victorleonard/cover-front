import Api from './Api.js'

export default {
  getInstruments () {
    return Api().get('/instruments')
  }
}
