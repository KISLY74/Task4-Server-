require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT
const app = express()
const cors = require('cors')
const models = require('./models/models')
const mongoose = require('mongoose')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const router = require('./routes/index')

app.use(cors())
app.use(express.json())
app.use(errorHandler)
app.use('/api', router)

const start = async () => {
  try {
    await mongoose.connect("mongodb+srv://sladky:17102001nikityz@task4.xfymnez.mongodb.net/?retryWrites=true&w=majority")
    app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))
  }
  catch (e) {
    console.log(e)
  }
}
start()
