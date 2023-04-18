import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { uniService } from '@/utils/request/axios'
import { useAuthStore, useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export async function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
      token: authStore.token,
    }
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return {
    data: {
      auth: true,
      model: 'ChatGPTAPI',
    } as T,
  }
  // return post<T>({
  //   url: '/session',
  // })
}

export async function fetchVerify(token: string) {
  try {
    const res = await uniService({
      url: '/verify',
      params: {
        token,
      },
    })
    if (res.data?.code === 200)
      Promise.resolve(res)
    else
      Promise.reject(res)
  }
  catch (error) {
    Promise.reject(error)
  }

  // return post<T>({
  //   url: '/verify',
  //   data: { token },
  // })
}

export async function login(params: { phone: string; password: string }) {
  try {
    const res = await uniService({
      url: '/login',
      params,
    })
    return res
  }
  catch (error) {
    Promise.reject(error)
  }

  // return post<T>({
  //   url: '/verify',
  //   data: { token },
  // })
}
