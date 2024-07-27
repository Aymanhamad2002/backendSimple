require('dotenv').config()

const Port = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV ==='test'? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI
const SECRET = 'abcdgggffwkzx'

module.exports = {
  Port,
  MONGODB_URI,
  SECRET
}
