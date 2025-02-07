const mongoose = require('mongoose')
require('dotenv').config()

// if (process.argv.length < 3) {
//     console.log('Please provide the password as an argument: node mongo.js <password>');
//     process.exit(1);
// }


const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)
console.log('connected to MONGODB')


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type:String,
    minLength:8,
    validate: {
      validator: function(v) {
        return /^(?:\d{2}-\d{6,}|\d{3}-\d{5,})$/.test(v)
      } },
    required:[true, 'User phone number required']
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})




const Person = mongoose.model('Person', personSchema)

module.exports = Person