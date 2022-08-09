const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/models')

const generateJwt = (id, email) => {
  return jwt.sign(
    { id, email },
    "0123dfrc",
    { expiresIn: "24h" }
  )
}

class UserController {
  async regin(req, res) {
    let { email, password, name } = req.body
    if (!email || !password || !name) {
      return res.status(404).json({ message: "Заполните пустые поля" })
    }
    const candidate = await User.findOne({ email: email })
    if (candidate !== null) {
      if (candidate.status !== "Delete") {
        return res.status(404).json({ message: "Пользователь с таким email уже существует" })
      }
    }
    password = password.toString()
    const hashPassword = await bcrypt.hash(password.toString(), 5)
    const user = new User({ email: email, password: hashPassword, name: name, dateRegin: new Date(Date.now()).toISOString(), dateLastLogin: "None", status: "Unblock" })
    await user.save()
    const token = generateJwt(user._id, user.email, user.name)
    return res.json({ token })
  }
  async login(req, res) {
    const { email, password } = req.body
    const user = await User.findOne({ email: email, status: { $ne: "Delete" } })
    if (!user) {
      return res.status(500).json({ message: "Пользователь не найден" })
    }
    const comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
      return res.status(500).json({ message: "Указан неверный пароль" })
    }
    const token = generateJwt(user._id, user.email, user.name)
    return res.json({ token })
  }
  async check(req, res) {
    const token = generateJwt(req.user._id, req.user.email, req.user.name)
    return res.json({ token })
  }
  async getUsers(req, res) {
    const users = await User.find()
    return res.json(users)
  }
  async getOneUser(req, res) {
    const users = await User.find({ email: req.body.email })
    for (let i = 0; i < users.length; i++) {
      if (users[i].status !== "Delete") {
        return res.json(users[i])
      }
    }
    return res.json(null)
  }
  async changeStatus(req, res) {
    const user = await User.findOneAndUpdate({ _id: req.body.id }, { status: req.body.status })
    return res.json(user)
  }
  async getCountUsersStatus(req, res) {
    const blockUsers = await User.find({ status: "Block" })
    const deleteUsers = await User.find({ status: "Delete" })
    const unblockUsers = await User.find({ status: "Unblock" })
    return res.json({ block: blockUsers.length, delete: deleteUsers.length, unblock: unblockUsers.length })
  }
  async changeDateLogin(req, res) {
    const user = await User.findOneAndUpdate(
      { _id: req.body.id }, {
      dateLastLogin: new Date(Date.now()).toISOString(),
    }
    );
    return res.json(user)
  }
}

module.exports = new UserController()