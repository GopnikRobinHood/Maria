const express = require('express')
const router = express.Router()
const Company = require('../models/companies')
const Car = require('../models/cars')
const jwt = require('jsonwebtoken')

const authenticate = require('../public/javascripts/checkAuthenticated')
const checkAuthenticated = authenticate.checkAuthenticated

// All Companies Route
router.get('/', checkAuthenticated, async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const companies = await Company.find(searchOptions)
    res.render('companies/index', {
      companies: companies,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Company Route
router.get('/new', checkAuthenticated, (req, res) => {
  res.render('companies/new', { company: new Company() })
})

// Create new Company Route
router.post('/', checkAuthenticated, async (req, res) => {
  const company = new Company({
    name: req.body.name
  })
  try {
    const newCompany = await company.save()
    res.redirect(`companies/${company.id}`)
  } catch {
    res.render('companies/new', {
      company: company,
      errorMessage: 'Error creating Company'
    })
  }
})

//Show company
router.get('/:id', checkAuthenticated, async (req, res) => {
  try{
    const company = await Company.findById(req.params.id)
    const cars = await Car.find({company : company.id}).limit(6).exec()
    res.render('companies/show', {company: company, carsByCompany: cars})
  } catch{
    res.redirect('/')
  }
  
})

//Edit company
router.get('/:id/edit', checkAuthenticated, async (req,res) => {
  try{
  const company = await Company.findById(req.params.id)
  res.render('companies/edit', { company: company })
  } catch {
    res.redirect('/companies')
  }
  
})

//Update company (after edit company)
router.put('/:id', checkAuthenticated, async (req, res) => {
  let company
  try {
    company = await Company.findById(req.params.id)
    company.name = req.body.name
    await company.save()
    res.redirect(`/companies/${company.id}`)
  } catch {
    if (company == null){
      res.redirect('/')
    } else {
      res.render('companies/edit', {
        company: company,
        errorMessage: 'Error updating Company'
      })
    }
  }
})


//Delete company
router.delete('/:id', checkAuthenticated, async (req, res) => {
  let company
  try {
    company = await Company.findById(req.params.id)
    await company.remove()
    res.redirect('/companies')
  } catch {
    if (company == null){
      res.redirect('/')
    } else {
      res.redirect(`/companies/${company.id}`)
    }
  }
})


module.exports = router