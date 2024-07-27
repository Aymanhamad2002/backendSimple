const Note = require('../models/note')
const User = require('../models/user')
const initialUsers = [
  {
    username:'ayman',
    name: 'ayman hamad',
    hashPassword:'ayman2002$'
  },
  {
    username:'fadi',
    name: 'fadi hamad',
    hashPassword:'ayman2002$'
  }
]

const initialNotes = [
  {
    content : 'hello world ',
    important : true,
  },
  {
    content : 'bye world' ,
    important : false,
  },
]
const notesInDb =  async () => {
  const notes = await Note.find({})
  return notes.map (note => note.toJSON())
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}
const nonExistingId = async () => {
  const note = new Note ({ content: 'will be removed' })
  await note.save()
  await note.deleteOne()
  return note._id.toString()
}
module.exports = {
  initialUsers,
  initialNotes,
  notesInDb,
  nonExistingId,
  usersInDb
}

