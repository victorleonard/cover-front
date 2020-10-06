import Api from './Api.js'
import Connect from './ConnectApi.js'

export default {
  getMe () {
    return Api().get('users/me')
  },
  getUsers () {
    return Api().get('/users')
  },
  getUser (userId) {
    return Api().get('/user/' + userId)
  },
  getProfile (userId) {
    // return Api().get('/profiles?filter{"where":{"userId":' + userId + '}}')
    return Api().get('/profiles?user.id=' + userId)
  },
  createProfile (pseudo, userId) {
    return Api().post('/profiles', {
      pseudo: pseudo,
      user: userId
    })
  },
  updateProfile (id, pseudo) {
    return Api().put('/profiles/' + id, {
      pseudo: pseudo
    })
  },
  register (username, email, password) {
    return Connect().post('/auth/local/register', {
      username: username,
      email: email,
      password: password
    })
  },
  logIn (email, password) {
    return Api().post('/auth/local', {
      identifier: email,
      password: password
    })
  }
}
