require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
const Note = require('./models/note')

app.get('/api/notes',(request,response)  => {
  Note.find({}).then(result => {
    console.log(result)
    response.json(result)
  })
})
app.delete('/api/notes/:id',(request,response) => {
  const id = request.params.id
  Note.findByIdAndDelete(id).then(result =>
    response.json(result)
  )
}
)
app.post('/api/notes',(request,response,next) => {
  const body = request.body
  const content = body.content
  const important = body.important || false
  const note = new Note({
    content,
    important
  })
  note
    .save()
    .then(result => response.json(result))
    .catch(error => next(error))

})
app.put('/api/notes/:id',(request,response) => {
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
const unkownEndPoint = (request,response) => {
  response.status(404).send({ error : 'unkown end point ' })

}
app.use(unkownEndPoint)

const errorHander = (error,request,response,next) => {
  console.log(error.message)
  if(error.name === 'CastError'){
    return response.status(400).send({ error:'malformated id' })
  }
  else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHander)
app.listen(process.env.PORT,() => {
  console.log(`Server is running on port : ${process.env.PORT}`)
})