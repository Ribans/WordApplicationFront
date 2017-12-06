import axios from 'axios'

export default axios.create({
  // baseURL: 'http://localhost:4567' //process.env.baseUrl
  baseURL: 'http://ec2-52-197-86-88.ap-northeast-1.compute.amazonaws.com:4567/' //process.env.baseUrl
})
