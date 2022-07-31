require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 8080
const app = express()
const cors = require('cors')
const sequelize = require('./db')

app.use(cors())
app.use(express.json())

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))
  }
  catch (e) {
    console.log(e)
  }
}
start()
