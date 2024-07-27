const config = require('./utils/config')
const app = require('./app')
const logger = require('./utils/logger')
app.listen(config.Port,() => {
  logger.info(`Server is running on port : ${config.Port}`)
})