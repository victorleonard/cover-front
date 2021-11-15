import axios from 'axios'

export default () => {
  console.log('token', localStorage.token)
  if (localStorage.token) {
    return axios.create({
      // baseURL: 'http://localhost:1337/'
      baseURL: 'https://cover-mobile.herokuapp.com/',
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }
    })
  } else {
    return axios.create({
      baseURL: 'https://cover-mobile.herokuapp.com/'
    })
  }
}
