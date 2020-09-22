import axios from 'axios'

export default() => {
  console.log('token', localStorage.token)
  return axios.create({
    baseURL: 'http://localhost:1337/',
    params: {
      'access_token': localStorage.token
    }
  })
}
