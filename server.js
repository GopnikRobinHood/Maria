if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//Require
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cookieParser=require('cookie-parser')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

// ROUTERS
const indexRouter = require('./routes/index')
const companiesRouter = require('./routes/companies')
const carsRouter = require('./routes/cars')
const adminRouter = require('./routes/admin')

//Views
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(methodOverride('_method'))
app.use(express.json())
app.use(cookieParser())
app.use(flash())
app.use(session({
    secret : process.env.ACCES_TOKEN_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


//Connect to MongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/companies', companiesRouter)
app.use('/cars', carsRouter)
app.use('/admin', adminRouter)

//Sever listens to...
const port = process.env.PORT
app.listen(port, () => console.log('http://localhost:5000'));
