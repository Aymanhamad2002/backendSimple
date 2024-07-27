const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')


mongoose.set('strictQuery',false)
const url = config.MONGODB_URI
console.log('connecting to the database ...')
mongoose.connect(url)
  .then(() => {
    logger.info('connected to the database')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB',error.message)
  })
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.logRequest)
app.use('/api/notes',notesRouter)
app.use('/api/users',usersRouter)
app.use('/api/login',loginRouter)
if(process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing',testingRouter)
}
app.use(middleware.unkownEndPoint)
app.use(middleware.errorHander)

module.exports = app
