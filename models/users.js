const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({   
  name: {
    type: String,
    required: true
  },

  password:{
    type: String,
    required: true
  },

  email:{
    type: String,
    required: true
  },

  role:{
    type: String,
    required: true
  },

  createdAt :{
    type: Date,
    required: true,
    default: Date.now
  }
})


userSchema.pre('save', function(next) {
  this.constructor.find({email: this.email}, (err, user) => {
    if(err){
      next(err)
    } else if (!user.length){
      next()
    } else {
      next(new Error('This E-Mail already exists!'))
    }
  })
})

module.exports = mongoose.model('User', userSchema)