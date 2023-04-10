import jwt from 'jsonwebtoken'
const secretKey = 'cgwf_z(xh5$kgjk3-g5#z819ho**%yp%@!%rsv)lqjy2@m_lsy'

interface ReqJwtPayload {
  /** 剩余次数 */
  count: number
}

const auth = (req, res, next) => {
  const Authorization = req.header('Authorization') || ''
  const token = Authorization.replace('Bearer ', '').trim()
  if (!token) {
    throw new Error('Error: 无访问权限')
  }
  else {
    try {
      const decoded = jwt.verify(token, secretKey) as ReqJwtPayload
      // 验证通过，保存相关信息，并允许客户端继续与服务端进行交互
      console.log(`验证信息：count: ${decoded.count}`)
      if (!decoded?.count || decoded.count <= 0)
        throw new Error('Error: 身份验证失败')

      next()
    }
    catch (error) {
      console.log('验证失败：', error)
      throw new Error('Error: 身份验证失败')
    }
  }
}

export { auth }
