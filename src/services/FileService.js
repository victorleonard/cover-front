import axios from 'axios'

export default {
  uploadFile (file) {
    const formData = new FormData()
    formData.append('files', file)
    return axios.post('http://localhost:1337/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.token}`
      }
    })
  }
}
