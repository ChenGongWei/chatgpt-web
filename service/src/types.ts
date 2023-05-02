import type { FetchFn } from 'chatgpt'

export interface RequestProps {
  prompt: string
  options?: ChatContext
  systemMessage: string
  temperature?: number
  top_p?: number
}

export interface ChatContext {
  conversationId?: string
  parentMessageId?: string
}

export interface ChatGPTUnofficialProxyAPIOptions {
  accessToken: string
  apiReverseProxyUrl?: string
  model?: string
  debug?: boolean
  headers?: Record<string, string>
  fetch?: FetchFn
}

export interface ModelConfig {
  apiModel?: ApiModel
  reverseProxy?: string
  timeoutMs?: number
  socksProxy?: string
  httpsProxy?: string
  usage?: string
}

export enum ApiType {
  /** 向女生提问 */
  Ask = 'ask',
  /** 回答女生 */
  Answer = 'answer',
  /** 脑洞大开 */
  Brain = 'brain',
  /** 海王语录 */
  Neptune = 'neptune',
  /** 笑话挑逗 */
  Joke = 'joke',
  /** 周公解梦 */
  Dream = 'dream'
}

export const TypeMap = {
  [ApiType.Ask]: `扮演一位有着丰富恋爱经验的男生 只需要在男生角度优化提问
    1.用{style}的话语
    2.可以适当使用{emoji}
    3,加点{emotion}的元素
    4.不要太暴露男生喜欢对方的需求，稍微可以倾向女生的关注
    5.正常聊天回答
    6.回答要简短
    7.不要太过于关注女生说的问题
    8.多角度地回8条回答
    向女生提问“{prompt}”`,
  [ApiType.Answer]: `扮演一位有着丰富恋爱经验的男生 只需要在男生角度回答
    1.用{style}的话语
    2.可以适当使用{emoji}
    3,加点{emotion}的元素
    4.不要太暴露男生喜欢对方的需求，稍微可以倾向女生的关注
    5.正常聊天回答
    6.回答要简短
    7.不要太过于关注女生说的问题
    8.多角度地回8条回答
    女生说的“{prompt}”`,
  [ApiType.Brain]: `扮演一位有着丰富恋爱经验的男生 只需要在男生角度进行编写谜语 
    1.只需要给出谜面和谜底
    2.要有土味情话的元素
    3.挑逗女生
    4.脑洞大开
    5.幡然醒悟
    6.解析一下谜底
    7.直接给出5个谜语`,
  [ApiType.Neptune]: `扮演一位有着丰富恋爱经验的男生 只需要在男生角度给女生写语录 
    1.要高情商、幽默、搞笑、挑逗等元素
    2.要简短而且肉麻
    3.适当使用emoji
    4.直接给出8条语录`,
  [ApiType.Joke]: `扮演一位有着丰富恋爱经验的男生 只需要在男生角度给女生写笑话故事
    1.要高情商、幽默、搞笑、挑逗等元素
    2.要简短而且肉麻
    3.适当使用emoji
    4.直接给出笑话`,
  [ApiType.Dream]: `扮演一位解梦大师 只需要在男生角度给女生解梦
    1.要高情商、幽默、搞笑、挑逗等元素
    2.要简短而且肉麻
    3.适当使用emoji
    4.直接给出解梦内容
    女生说：“{prompt}”`
}

export type ApiModel = 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI' | undefined
