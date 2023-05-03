import express from 'express'
import WebSocket from "ws"
import { ApiType, TypeMap } from './types'
import type { ChatContext, ChatMessage } from "./chatgpt"
import {  chatReplyProcess } from './chatgpt'
import { auth } from './middleware/auth'
// import { limiter } from './middleware/limiter'
// import { isNotEmptyString } from './utils/is'

interface WebSocketParams {
  prompt: string;
  type?: ApiType;
  filters?: Record<string, string[]>,
  options?: ChatContext;
  systemMessage?: string;
}

const WebSocketServer = WebSocket.Server

const wss = new WebSocketServer({
    host: "0.0.0.0",
    port: 9000,
})

const sendMessage = (
    ws: WebSocket.WebSocket,
    msg: string,
    callback?: Function
) => {
    ws.send(msg, (err) => {
        if (callback) callback()
        if (err) {
            console.log(`[Send] err: ${err}`)
        }
    })
}


wss.on("connection", function (ws, req) {
    console.log(`[SERVER] connection() -- ip：${req?.connection?.remoteAddress}`)

    ws.on("close", (...res) => {
        console.log("[SERVER] close：", JSON.stringify(res))
    })

    ws.on("error", (...res) => {
        console.log("[SERVER] error：", res)
    })

    // 校验不通过，关闭连接
    const check = auth(req)


    if (!check) {
        sendMessage(
            ws,
            JSON.stringify({
                code: 403,
                msg: "校验失败",
            }),
            () => ws.close()
        )
        return
    }

    const ask = async (data: WebSocketParams) => {
      const { prompt, type, filters, options = {}, systemMessage = '你是一个智能助手，名叫解惑者，你的回答里不能出现ChatGPT的文字以及色情、恐怖、政治敏感内容' } = data

      // 普通问答
      if (!type && !prompt) {
        sendMessage(
          ws,
          JSON.stringify({
              code: 400,
              msg: "请输入提问内容",
          })
        )
        ws.close()
      }

      let message = ''
      if (type) {
        message = TypeMap[type]
        const keys = Object.keys(filters)
        keys.forEach(key => {
          message = message.replace(`{${key}}`, filters[key].join('、'))
        })
        message = message.replace('{prompt}', prompt)
      } else {
        message = prompt
      }

      try {
        const res = await chatReplyProcess({
            message,
            lastContext: options,
            process: (chat: ChatMessage) => {
                sendMessage(
                    ws,
                    JSON.stringify({
                        code: 200,
                        ...chat,
                    })
                )
            },
            systemMessage,
          }
        )
        console.log("回答：", res)
        sendMessage(
            ws,
            JSON.stringify({
                code: 200,
                text: "[DONE]",
            }),
            () => ws.close()
        )
      } catch (error) {
          console.log(error)
          sendMessage(
              ws,
              JSON.stringify({
                  code: 400,
                  msg: "服务异常",
              }),
              () => ws.close()
          )
      }
    }    

    ws.on("message", async (message) => {
        console.log("提问信息：", message.toString())

        const data = JSON.parse(message.toString() || "{}") as WebSocketParams
        ask(data)
    })
})


// const app = express()
// const router = express.Router()

// app.use(express.static('public'))
// app.use(express.json())

// app.all('*', (_, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
//   res.header('Access-Control-Allow-Methods', '*')
//   next()
// })

// router.post('/chat-process', [auth, limiter], async (req, res) => {
//   res.setHeader('Content-type', 'application/octet-stream')

//   try {
//     const { prompt, options = {}, systemMessage, temperature, top_p } = req.body as RequestProps
//     let firstChunk = true
//     await chatReplyProcess({
//       message: prompt,
//       lastContext: options,
//       process: (chat: ChatMessage) => {
//         res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
//         firstChunk = false
//       },
//       systemMessage,
//       temperature,
//       top_p,
//     })
//   }
//   catch (error) {
//     res.write(JSON.stringify(error))
//   }
//   finally {
//     res.end()
//   }
// })

// router.post('/config', auth, async (req, res) => {
//   try {
//     const response = await chatConfig()
//     res.send(response)
//   }
//   catch (error) {
//     res.send(error)
//   }
// })

// router.post('/session', async (req, res) => {
//   try {
//     const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
//     const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
//     res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
//   }
//   catch (error) {
//     res.send({ status: 'Fail', message: error.message, data: null })
//   }
// })

// router.post('/verify', async (req, res) => {
//   try {
//     const { token } = req.body as { token: string }
//     if (!token)
//       throw new Error('Secret key is empty')

//     if (process.env.AUTH_SECRET_KEY !== token)
//       throw new Error('密钥无效 | Secret key is invalid')

//     res.send({ status: 'Success', message: 'Verify successfully', data: null })
//   }
//   catch (error) {
//     res.send({ status: 'Fail', message: error.message, data: null })
//   }
// })

// app.use('', router)
// app.use('/api', router)
// app.set('trust proxy', 1)

// app.listen(9000, () => globalThis.console.log('Server is running on port 9000'))
