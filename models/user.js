const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name:String,
  username: {
    type:String,
    required: true,
    unique:true,
  },
  hashPassword:String,
  notes : [{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Note'
  }],
})

userSchema.set('toJSON',{
  transform : (document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.hashPassword
  }
})
const User = mongoose.model('User',userSchema)
module.exports = User