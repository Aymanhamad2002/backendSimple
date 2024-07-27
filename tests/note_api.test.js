const {describe,after,test,beforeEach } = require('node:test')
const mongoose = require('mongoose')
const assert =  require('node:assert')
const helper = require('./helper')
const Note = require('../models/note')
const app = require('../app')
const supertest = require('supertest')

const api = supertest(app)


beforeEach(async () => {
  await Note.deleteMany({})
  const noteObjects = helper.initialNotes.map(note => new Note(note))
  const promisesArray = noteObjects.map(note => note.save())
  return Promise.all(promisesArray)
})

test('notes are returned as json' , async () => {
  await  api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type',/application\/json/)
})

test('all notes are returned ', async () => {
  const result = await api.get('/api/notes')

  assert.strictEqual(result.body.length , helper.initialNotes.length)
} )

test('a specific notes returned ', async () => {
  const result = await helper.notesInDb()
  const specificNote = result[0]
  console.log(specificNote.id)
  const response = await  api.get(`/api/notes/${specificNote.id}`).expect(200).expect('Content-Type',/application\/json/)
  assert.deepEqual(response.body,specificNote)



})
test('getting a 404 if the specific user not found', async () => {
  const id = await helper.nonExistingId()
  await api.get(`/api/notes/${id}`).expect(404)
})

test('getting 400 for invalid user ', async () => {
  const id = '134384389483ddfffddd843848'
  await api.get(`/api/notes/${id}`).expect(400)
})
after( async() => {
  await  mongoose.connection.close()
}
)



