require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
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
  Note.findByIdAndDelete(id).then( result=>
    response.status(204).end()
  )
}

)
app.listen(process.env.PORT,() => {
  console.log(`Server is running on port : ${process.env.PORT}`)
})