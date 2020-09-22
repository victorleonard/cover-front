import state from './state'
import createPersistedState from 'vuex-persistedstate'
// import SongService from './../../services/SongService'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

export default {
  namespaced: true,
  plugins: [
    createPersistedState({
      paths: ['user']
    })
  ],
  state,
  getters,
  mutations,
  actions
}
