const express = require('express')
const router = express.Router()
const multer = require('multer')
const Car = require('../models/cars')
const path = require('path')
const uploadPath = path.join('public', Car.imageBasePath)
const Company = require('../models/companies')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All Cars Route
router.get('/', async (req, res) => {
  res.send('All cars')
})

// New Car Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Car())
})

// Create Car Route
router.post('/', upload.single('image'), async (req, res) => {
  const filename = req.file !=null ? req.file.filename : null
  const car = new Car({
    model: req.body.model,
    company: req.body.company,
    releaseDate: new Date(req.body.releaseDate),
    PS: req.body.PS,
    imageName: filename,
    description: req.body.description
  })

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
  } catch {
    res.redirect('/cars')

  }
}


module.exports = router