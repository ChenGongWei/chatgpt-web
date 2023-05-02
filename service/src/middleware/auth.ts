import jwt from 'jsonwebtoken'
const secretKey = 'cgwf_z(xh5$kgjk3-g5#z819ho**%yp%@!%rsv)lqjy2@m_lsy'

interface ReqJwtPayload {
  /** 剩余次数 */
  count: number
}

const auth = (req) => {
  const Authorization = req.headers.authorization || ''
  const token = Authorization.replace('Bearer ', '').trim()
  if (!token) {
    return false
  }
  
  try {
    const decoded = jwt.verify(token, secretKey) as ReqJwtPayload
    // 验证通过，保存相关信息，并允许客户端继续与服务端进行交互
    console.log(`验证信息：count: ${decoded.count}`)
    if (!decoded?.count || decoded.count <= 0) {
      return false
    }
    return true

  } catch (error) {
    console.log('验证失败：', error)
    return false
  }
  
}

export { auth }
