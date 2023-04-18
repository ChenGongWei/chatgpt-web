import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store'

const service = axios.create({
  baseURL: import.meta.env.VITE_GLOB_API_URL,
})

export const uniService = axios.create({
  baseURL: 'https://fc-mp-31ff25ad-0fd0-4a64-b6f8-936f84c8dc1f.next.bspapp.com/ali-chat',
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
