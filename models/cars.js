const mongoose = require('mongoose')

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
  image:{
    type: Buffer,
    required: true
  },

  imageType:{
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
  
  if(this.image != null && this.imageType != null){
    return `data:${this.imageType};charset=utf8;base64,${this.image.toString('base64')}`
  }
})


module.exports = mongoose.model('Car', carSchema)