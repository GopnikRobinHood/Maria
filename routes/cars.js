const express = require('express')
const router = express.Router()
const Car = require('../models/cars')
const Company = require('../models/companies')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

const authenticate = require('../public/javascripts/checkAuthenticated')
const checkAuthenticated = authenticate.checkAuthenticated

// All Cars Route
router.get('/', checkAuthenticated, async (req, res) => {
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
router.get('/new', checkAuthenticated, async (req, res) => {
    renderNewPage(res, new Car())
})

//Show car
router.get('/:id', checkAuthenticated, async (req, res) => {
  try{
    const car = await Car.findById(req.params.id).populate('company').exec()
    res.render('cars/show', {car: car})
  } catch {
    res.redirect('/')
  }
  
})


// Create Car Route
router.post('/', checkAuthenticated, async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const car = new Car({
    model: req.body.model,
    company: req.body.company,
    releaseDate: new Date(req.body.releaseDate),
    PS: req.body.PS,
    description: req.body.description
  })
  saveImage(car, req.body.image)

  try{
    const newCar = await car.save()
    res.redirect(`cars/${newCar.id}`)
  } catch {
    renderNewPage(res, car, true)
  }
})

//Edit Car Route
router.get('/:id/edit', checkAuthenticated, async (req, res) => {
  try{
    const car = await Car.findById(req.params.id)
    renderEditPage(res, car)
  } catch {
    res.redirect('/')
  }
  
})

//Upload Car Route
router.put('/:id', checkAuthenticated, async (req, res) => {
  let car
  try{
    const car = await Car.findById(req.params.id)
    
    car.model = req.body.model    
    car.description = req.body.description
    car.releaseDate = req.body.releaseDate
    car.PS = req.body.PS
    car.company = req.body.company
    if(req.body.image != null && req.body.image != ''){
      saveImage(car, req.body.image)
    }

  res.redirect(`/cars/${car.id}`)
  await car.save()
  } catch{
    if (car != null){
      renderEditPage(res, car, true)
    } else{
      res.redirect('/')
    }
  }
})

//Delete Car Route
router.delete('/:id', checkAuthenticated, async (req, res) => {
  let car
  try {
    car = await Car.findById(req.params.id)
    await car.remove()
    res.redirect('/cars')
  } catch {
    if (car != null){
      res.render('cars/show',{
        car: car,
        errorMessage: 'Could not remove car'
      })
    } else {
      res.redirect('/')
    }
  }
})




async function renderNewPage(res, car, hasError = false){
  renderFormPage(res, car, 'new', hasError)
}

async function renderEditPage(res, car, hasError = false){
  renderFormPage(res, car, 'edit', hasError)
}

async function renderFormPage(res, car, form, hasError = false){
  try {
    const companies = await Company.find({})
    const params = {
      companies: companies,
      car: car
    }
    if (hasError) params.errorMessage = 'Error creating car'
    res.render(`cars/${form}`, params)
  } catch{
    res.redirect('/cars')

  }
}

function saveImage(car, imageEncoded) {
  if (imageEncoded == null) return
  const image = JSON.parse(imageEncoded)
  if (image != null && imageMimeTypes.includes(image.type)) {
    car.image = new Buffer.from(image.data, 'base64')
    car.imageType = image.type
  }
}


module.exports = router