const loginRouter = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../utils/config');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })

  if (user === null) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  // Debugging: log user and hashed password
  console.log('User found:', user)
  console.log('Hashed password:', user.hashPassword)

  const passwordCorrect = await bcrypt.compare(password, user.hashPassword)

  // Debugging: log the result of password comparison
  console.log('Password correct:', passwordCorrect)

  if (!passwordCorrect) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60 * 60 })

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
