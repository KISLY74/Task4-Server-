const { Schema, model } = require('mongoose')

const User = new Schema({
  id: { type: String, unique: true, require: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  dateRegin: { type: String, required: true },
  dateLastLogin: { type: String },
  status: { type: String, required: true },
}, {
  versionKey: false
})

module.exports = new model('User', User)