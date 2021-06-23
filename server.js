if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//Require
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// ROUTERS
const indexRouter = require('./routes/index')
const companiesRouter = require('./routes/companies')
const carsRouter = require('./routes/cars')

// const profileRouter = require('./routes/profile')
// const guestRouter = require('./routes/guests')

//Views
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(methodOverride('_method'))

//Connect to MongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


app.use('/', indexRouter)
app.use('/companies', companiesRouter)
app.use('/cars', carsRouter)

//Sever listens to...
const port = process.env.PORT
app.listen(port, () => console.log('http://localhost:5000/'));
