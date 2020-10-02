import Api from './Api.js'

export default {
  getSongs () {
    return Api().get('/selection')
  },
  searchOnSpotify (song) {
    return Api().get('/searches?song=' + song)
  }
}
