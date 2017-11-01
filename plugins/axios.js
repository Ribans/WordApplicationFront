import axios from 'axios'

export default axios.create({
  baseURL: 'http://localhost:4567' //process.env.baseUrl
})
