import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'https://cover-mobile.herokuapp.com/'
  })
}
