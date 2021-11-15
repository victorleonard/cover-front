import Api from './Api.js'
import Connect from './ConnectApi.js'

export default {
  getVersion () {
    return this.$axios.get('/version')
  },
  getMe () {
    return Api().get('users/me')
  },
  getUsers () {
    return Api().get('/users')
  },
  getUser (userId) {
    return Api().get('/user/' + userId)
  },
  getProfile (profileId) {
    // return Api().get('/profiles?filter{"where":{"userId":' + userId + '}}')
    return Api().get('/profiles/' + profileId)
  },
  getProfiles () {
    return Api().get('/profiles')
  },
  createProfile (pseudo, userId) {
    return Api().post('/profiles', {
      pseudo: pseudo,
      user: userId
    })
  },
  updateProfile (id, pseudo, instruments, avatar, commune, codeDepartement, codeRegion) {
    return Api().put('/profiles/' + id, {
      pseudo: pseudo,
      instruments: instruments,
      avatar: avatar,
      commune: commune,
      codeDepartement: codeDepartement,
      codeRegion: codeRegion
    })
  },
  setIosDeviceToken (userId, token) {
    return Api().put('/users/' + userId, {
      iosDeviceToken: token
    })
  },
  register (username, email, password) {
    return Connect().post('/auth/local/register', {
      username: username,
      email: email,
      password: password
    })
  },
  forgotPassword (email) {
    return Connect().post('/auth/forgot-password', {
      email: email
    })
  },
  resetPassword (code, password, passwordConfirmation) {
    return Connect().post('/auth/reset-password', {
      code: code,
      password: password,
      passwordConfirmation: passwordConfirmation
    })
  },
  sendEmailConfirmation (email) {
    return Connect().post('/auth/send-email-confirmation', {
      email: email
    })
  },
  logIn (email, password) {
    return Api().post('/auth/local', {
      identifier: email,
      password: password
    })
  }
}
