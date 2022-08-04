const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  dateRegin: { type: DataTypes.DATE },
  dateLastLogin: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING }
})

module.exports = User