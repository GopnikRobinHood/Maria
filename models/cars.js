const mongoose = require('mongoose')
const imageBasePath = 'uploads/carCovers'
const path = require('path')


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
  imageName:{
    type: String,
    required: true
  },

  company:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Company'
  }
})


carSchema.virtual('imagePath').get(function(){
  
  if(this.imageName != null){
    return path.join('/', imageBasePath, this.imageName)
  }
})


module.exports = mongoose.model('Car', carSchema)
module.exports.imageBasePath = imageBasePath