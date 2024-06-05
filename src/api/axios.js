import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://back.ey/api/'
})

export default apiClient