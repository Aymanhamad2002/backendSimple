const logger = require('./logger')

const logRequest = (request,response,next) => {
  logger.info('Method: ',request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ',request.body)
  logger.info('---')
  next()

}

const unkownEndPoint = (request,response) => {
  response.status(404).send({ error : 'unkown end point ' })
}
const errorHander = (error,request,response,next) => {
  logger.error(error.message)
  if(error.name === 'CastError'){
    return response.status(400).send({ error:'malformated id' })
  }
  else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }else if (error.name ==='MongoServerError' && error.message.includes('E11000 duplicate key error')){
    return response.status(400).json( { error: 'expected username to be unique' })
  }else if (error.name === 'TokenExpiredError'){
    return response.status(401).json( {error: 'token expired ' })
  }
  next(error)
}
module.exports = {
  unkownEndPoint,
  errorHander,
  logRequest
}