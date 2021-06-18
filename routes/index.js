const express = require('express')
const router = express.Router()
const Car = require('../models/cars')

router.get('/', async (req, res) => {
  let cars 
  try{
    cars = await Car.find().sort({ createdAt: 'desc'}).limit(3).exec()
  } catch {
    cars = []
  }
  res.render('index', {cars: cars})
 
})

module.exports = router