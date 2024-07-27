const notesRouter = require('express').Router()
const config = require('../utils/config')
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ','')
  }
  return null

}

notesRouter.get('/', async (request,response)  => {
  const result = await Note.find({})
  response.json(result)
})
notesRouter.get('/:id',async (request,response) => {
  const result = await Note.findById(request.params.id)
  if(result)
    response.json(result)
  else
    response.status(404).end()
})
notesRouter.delete('/:id',(request,response) => {
  const id = request.params.id
  Note.findByIdAndDelete(id).then(result =>
    response.json(result)
  )
}
)
notesRouter.post('/',async(request,response,next) => {
  const body = request.body
  const content = body.content
  const important = body.important || false

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token,config.SECRET)
  if(!decodedToken){
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const note = new Note({
    content,
    important,
    user:user._id
  })
  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(201).json(savedNote)

})
notesRouter.put('/:id',(request,response) => {
  const body = request.body
  const note = {
    content: body.content,
    important : body.important,
  }
  Note.findByIdAndUpdate(request.params.id,note ,{ new: true ,runValidators: true,context:'query' })
    .then(result => {
      response.json(result)
    })
})

module.exports =notesRouter