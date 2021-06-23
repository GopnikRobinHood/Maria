const express = require('express')
const router = express.Router()
const Company = require('../models/companies')

// All Companies Route
router.get('/', async (req, res) => {
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
router.get('/new', (req, res) => {
  res.render('companies/new', { company: new Company() })
})

// Create Company Route
router.post('/', async (req, res) => {
  const company = new Company({
    name: req.body.name
  })
  try {
    const newCompany = await company.save()
    // res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`companies`)
  } catch {
    res.render('companies/new', {
      company: company,
      errorMessage: 'Error creating Company'
    })
  }
})

router.get('/:id', (req, res) => {
  res.send('Show company ' + req.params.id)
})

router.get('/:id/edit', async (req,res) => {
  try{
  const company = await Company.findById(req.params.id)
  res.render('companies/edit', { company: company })
  } catch {
    res.redirect('/companies')
  }
  
})

router.put('/:id', (req, res) => {
  res.send('Update company ' + req.params.id)
})

router.delete('/:id', (req, res) => {
  res.send('Delete company ' + req.params.id)
})


module.exports = router