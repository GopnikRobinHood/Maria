const mongoose = require('mongoose')
const Car = require('./cars')
const companySchema = new mongoose.Schema({
    
    name: {
    type: String,
    required: true
  }
})
//If there is a car assigned to this company the company will not be deleted
companySchema.pre('remove', function(next) {
  Car.find({company: this.id}, (err, cars) => {
    if(err){
      next(err)
    } else if (cars.length > 0){
      next(new Error('This company has cars still'))
    } else {
      next()
    }
  })
})
module.exports = mongoose.model('Company', companySchema)