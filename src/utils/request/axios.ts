import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store'

const service = axios.create({
  baseURL: import.meta.env.VITE_GLOB_API_URL,
})

export const uniService = axios.create({
  baseURL: 'https://fc-mp-e1f99a1a-8af0-497c-a5ea-5eb4e950d30c.next.bspapp.com/chat',
})

service.interceptors.request.use(
  (config) => {
    const token = useAuthStore().token
    if (token && !config.headers?.Authorization)
      config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
