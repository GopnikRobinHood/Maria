const express = require('express')
const router = express.Router()
const multer = require('multer')
const Car = require('../models/cars')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', Car.imageBasePath)
const Company = require('../models/companies')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

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
router.post('/', upload.single('image'), async (req, res) => {
  console.log('Processing...')
  const fileName = req.file != null ? req.file.filename : null
  console.log(fileName)
  const car = new Car({
    model: req.body.model,
    company: req.body.company,
    releaseDate: new Date(req.body.releaseDate),
    PS: req.body.PS,
    imageName: fileName,
    description: req.body.description
  })
  //saveCover(car, req.body.cover)

  try{
    const newCar = await car.save()
    //console.log(carImagePath)
    res.redirect(`cars`)
  } catch {
    if (car.carImageName != null) {
      removeCarImage(car.carImageName)
    }
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
  } catch (err){
    console.log(err)
    res.redirect('/cars')

  }
}


function removeCarImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}

// function saveCover(car, coverEncoded) {
//   if (coverEncoded == null) return
//   const cover = JSON.parse(coverEncoded)
//   if (cover != null && imageMimeTypes.includes(cover.type)) {
//     car.coverImage = new Buffer.from(cover.data, 'base64')
//     car.coverImageType = cover.type
//   }
// }


module.exports = router