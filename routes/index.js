const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const Car = require('../models/cars')
//authenticateToken = require('../public/javascripts/authenticateToken')

//Private Route
router.get('/', authenticateToken, async (req, res) => {
  console.log(req.user.name)
  let cars
  try{
    cars = await Car.find().sort({ createdAt: 'desc'}).limit(3).exec()
  } catch {
    cars = []
  }
  res.render('index', {cars: cars})
})

//Get all users
router.get('/users', async (req, res) => {
  const users = await User.find({})
  res.send(users)
  //res.render('login.ejs', {messages: "hello"})
})

//Get all users
router.get('/users/login', async (req, res) => {
  res.render('login.ejs', {messages: ""})
})


//Create new user
router.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = new User({
      name: req.body.name,
      password: hashedPassword
    })

    const newUser = await user.save()
    res.status(201).send('User created')
  } catch(err) {
    res.status(500).send('Error on the server')
  }
})

//Login
router.post('/users/login', async (req, res) => {
  try{
    //Get user
    const user = await User.findOne({name: req.body.name})

    //Check if user is in db
    if (!user) return res.status(404).send('No user found')

    //Ceck if pw is right
    var passwordIsValid = await bcrypt.compare(req.body.password, user.password)
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })
      
    //Create token
    var token = jwt.sign({ _id: user._id, name: user.name }, process.env.ACCES_TOKEN_SECRET, {
      expiresIn: '20s' // expires in 24 hours
    });
      
    //Send token
    res.cookie('authorization', 'Bearer '+ token, {httpOnly: true})
    res.redirect('/')

  }catch(err){
    if (err) return res.status(500).send('Error on the server')
  }
})


//Logout
router.delete('/users/logout', async(req, res)=>{
      //Send token
      res.cookie('authorization', 'expired', {httpOnly: true})
      res.redirect('/users/login')
})

//Authenticate Token
function authenticateToken(req, res, next) {
  const authHeader = req.cookies.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return  res.sendStatus(401)

  jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, user) =>{
      if (err) return res.sendStatus(403)
      req.user = user
      next()
  })
}

module.exports = router