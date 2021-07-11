const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({   
  source: {
    type: String,
    required: true
  },

  userId: {
    type: String,
    required: true
  },

  userName: {
    type: String,
    required: true
  },

  action: {
    type: String,
    required: true
  },

  date :{
    type: Date,
    required: true,
    default: Date.now
  }
})


module.exports = mongoose.model('Log', logSchema)