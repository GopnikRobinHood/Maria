const express = require('express')
const router = express.Router()
const Car = require('../models/cars')
const Company = require('../models/companies')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']


// All Cars Route
router.get('/', async (req, res) => {
  let query = Car.find()
  if (req.query.model != null && req.query.model != '') {
    query = query.regex('model', new RegExp(req.query.model, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('releaseDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('releaseDate', req.query.publishedAfter)
  }
  try {
    const cars = await query.exec()
    res.render('cars/index', {
      cars: cars,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Car Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Car())
})

// Create Car Route
router.post('/', async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const car = new Car({
    model: req.body.model,
    company: req.body.company,
    releaseDate: new Date(req.body.releaseDate),
    PS: req.body.PS,
    description: req.body.description
  })
  saveCover(car, req.body.image)

  try{
    const newCar = await car.save()
    res.redirect(`cars`)
  } catch {
    renderNewPage(res, car, true)
  }

})

async function renderNewPage(res, car, hasError = false){
  try {
    const companies = await Company.find({})
    const params = {
      companies: companies,
      car: car
    }

    if (hasError) params.errorMessage = 'Error creating car'
    res.render('cars/new', params)
  } catch{
    res.redirect('/cars')

  }
}


function saveCover(car, imageEncoded) {
  if (imageEncoded == null) return
  const image = JSON.parse(imageEncoded)
  if (image != null && imageMimeTypes.includes(image.type)) {
    car.image = new Buffer.from(image.data, 'base64')
    car.imageType = image.type
  }
}


module.exports = router