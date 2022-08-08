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
  async regin(req, res) {
    const { email, password, name } = req.body
    if (!email || !password) {
      return res.status(404).json({ message: "Неккоректный email или password" })
    }
    const candidates = await User.findAll({ where: { email: email } })
    if (candidates.length !== 0) {
      if (candidates.some(e => e.status !== "Delete")) {
        return res.status(404).json({ message: "Пользователь с таким email уже существует" })
      }
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({ email, password: hashPassword, name: name, status: "Unblock", dateRegin: new Date(Date.now()).toISOString().slice(0, 10) }).catch((err) => console.log(err))
    const token = generateJwt(user.id, user.email, user.name)
    return res.json({ token })
  }
  async login(req, res) {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(500).json({ message: "Пользователь не найден" })
    }
    const comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
      return res.status(500).json({ message: "Указан неверный пароль" })
    }
    const token = generateJwt(user.id, user.email, user.name)
    return res.json({ token })
  }
  async check(req, res) {
    const token = generateJwt(req.user.id, req.user.email, req.user.name)
    return res.json({ token })
  }
  async getUsers(req, res) {
    const users = await User.findAll({ order: [['id', 'ASC'],] })
    return res.json(users)
  }
  async getOneUser(req, res) {
    const users = await User.findAll({ where: { email: req.body.email } })
    for (let i = 0; i < users.length; i++) {
      if (users[i].status !== "Delete") {
        return res.json(users[i])
      }
    }
    return res.json(null)
  }
  async changeStatus(req, res) {
    const user = await User.update(
      {
        status: req.body.status,
      },
      {
        where: { id: req.body.id },
      }
    );
    return res.json(user)
  }
  async getCountUsersStatus(req, res) {
    const blockUsers = await User.findAll({ where: { status: "Block" } })
    const deleteUsers = await User.findAll({ where: { status: "Delete" } })
    const unblockUsers = await User.findAll({ where: { status: "Unblock" } })
    return res.json({ block: blockUsers.length, delete: deleteUsers.length, unblock: unblockUsers.length })
  }
  async changeDateLogin(req, res) {
    const user = await User.update(
      {
        dateLastLogin: new Date(Date.now()).toISOString().slice(0, 10),
      },
      {
        where: { email: req.body.email },
      }
    );
    return res.json(user)
  }
}

module.exports = new UserController()