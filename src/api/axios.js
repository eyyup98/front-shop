import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'https://back.etaganov-trade.ru/api'
})

export default apiClient