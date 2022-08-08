const { Schema, model } = require('mongoose')

const User = new Schema({
  id: { type: Number, unique: true, autoIncrement: true, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  dateRegin: { type: Date, required: true },
  dateLastLogin: { type: Date },
  status: { type: String, required: true },
})

module.exports = new model('User', User)