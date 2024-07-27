const { describe,test,after,beforeEach }  = require('node:test')
const assert = require('assert')
const  User  = require('../models/user')
const app = require('../app')
const supertest = require('supertest')
const helper = require('./helper')
const mongoose = require('mongoose')

const api = supertest(app)


beforeEach(async() => {
  await User.deleteMany({})
  const userObjects = helper.initialUsers.map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
})
test('make sure all the users are returned as json', async () => {
  await api.get('/api/users')
    .expect(200)
  const response = await api.get('/api/users')
  assert.strictEqual(response.body.length,helper.initialUsers.length)
})
test('get a specific user using username', async () => {
  const userAtTheStart =  await helper.usersInDb()
  const specificUser = userAtTheStart[0]
  const response =  await api.get(`/api/users/${specificUser.username}`)
    .expect(200)
    .expect('Content-Type',/application\/json/)
  assert.deepEqual(response.body,specificUser)
})

test('a new user is created successful',async() => {
  const usersAtStart = await helper.usersInDb()
  const newUser = {
    username: 'tony',
    name :'tony kiwan',
    hashPassword : '1234566'
  }
  await api.post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type',/application\/json/)

  const usersAtEnd = await helper.usersInDb()
  const contents = usersAtEnd.map(user => user.username)
  assert.strictEqual(usersAtEnd.length,usersAtStart.length +1)
  assert(contents.includes(newUser.username))
})

test('username with that already exist will be declined', async () => {
  const newUser = {
    username : 'ayman',
    name: 'ayman hamad',
    hashPassword: '123456'
  }
  await api.post('/api/users')
    .send(newUser)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})