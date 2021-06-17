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
  const car = new Car({
    model: req.body.model,
    company: req.body.company,
    releaseDate: new Date(req.body.releaseDate),
    PS: req.body.PS,
    imageName: fileName,
    description: req.body.description
  })
  console.log('Car created...')
  //saveCover(car, req.body.cover)

  try{
    console.log('Trying to safe car...')
    const newCar = await car.save()
    res.redirect(`cars`)
    console.log('Car safed!')
  } catch {
    renderNewPage(res, car, true)
    console.log('Error creating car!')
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

// function saveCover(car, coverEncoded) {
//   if (coverEncoded == null) return
//   const cover = JSON.parse(coverEncoded)
//   if (cover != null && imageMimeTypes.includes(cover.type)) {
//     car.coverImage = new Buffer.from(cover.data, 'base64')
//     car.coverImageType = cover.type
//   }
// }


module.exports = router