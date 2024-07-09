require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
const Note = require('./models/note')

app.get('/api/notes',(request,response)  => {
  Note.find({}).then(result => {
    console.log(result)
    response.json(result)
  })
})


app.listen(process.env.PORT,() => {
  console.log(`Server is running on port : ${process.env.PORT}`)
})