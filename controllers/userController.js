const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/models')

const generateJwt = (id, email) => {
  return jwt.sign(
    { id, email },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  )
}

class UserController {
  async regin(req, res, next) {
    const { email, password, name } = req.body
    if (!email || !password) {
      return next(ApiError.badRequest('Неккоректный email или password'))
    }
    const candidate = await User.findOne({ where: { email } })
    if (candidate) {
      return next(ApiError.badRequest('Пользователь с таким email уже существует'))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({ email, password: hashPassword, name: name, status: "Unblock", dateRegin: new Date(Date.now()).toISOString().slice(0, 10) })
    const token = generateJwt(user.id, user.email)
    return res.json({ token })
  }
}

module.exports = new UserController()