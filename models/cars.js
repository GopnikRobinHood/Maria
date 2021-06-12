const mongoose = require('mongoose')

const imageBasePath = 'uploads/carCovers'


const carSchema = new mongoose.Schema({
    
  model: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  releaseDate:{
    type: Date,
    required: true
  },
  PS:{
    type: Number,
    required: true
  },
  createdAt :{
    type: Date,
    required: true,
    default: Date.now
  },
  ImageName:{
    type: String,
    required: true
  },

  company:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Company'
  }

})

module.exports = mongoose.model('Car', carSchema)
module.exports.imageBasePath = imageBasePath