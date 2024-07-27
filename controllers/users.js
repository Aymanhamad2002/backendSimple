const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request,response) => {
  const results = await User.find({}).populate('notes')
  response.json(results)
})

usersRouter.get('/:username', async (request,response) => {
  const result = await User.find({ username:request.params.username })
  if (result.length>0)
    response.json(result[0])
  else
    response.status(404).end()
})
usersRouter.post('/' ,async (request,response) => {
  const body = request.body
  const name = body.name
  const username = body.username
  const hashPassword = await bcrypt.hash(body.password,10)
  const newUser = new User({ username,name,hashPassword })

  const result = await newUser.save()
  response.status(201).json(result)


})



module.exports = usersRouter
