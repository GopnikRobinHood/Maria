const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const passport = require('passport')
const User = require('../models/users')
const Car = require('../models/cars')
const initializePassport = require('../public/javascripts/passport-config')
const authenticate = require('../public/javascripts/checkAuthenticated')
const checkAuthenticated = authenticate.checkAuthenticated
const checkNotAuthenticated = authenticate.checkNotAuthenticated

const { ROLE, users } = require('../public/javascripts/userData')

initializePassport(
  passport
)


//Move this to Javascripts
authRole =function(role, userData){ 
  return async (req, res, next) => {
    const id = req.session.passport.user
    const allUsers = await userData
    const user = allUsers.find(user => user.id === id)
    if(role !== user.role){
      return res.status(403).send('Permission denied!')
    }
    next()
  }
}


router.get('/',checkAuthenticated, async (req, res) => {
  
  let cars
  try{
    cars = await Car.find().sort({ createdAt: 'desc'}).limit(3).exec()
  } catch {
    cars = []
  }
  res.render('index', {cars: cars})
})


//Get all users
// router.get('/users', async (req, res) => {
//   const users = await User.find({})
//   res.send(users)
// })

//Get Admin page
router.get('/admin',checkAuthenticated, authRole(ROLE.ADMIN, users), async (req, res) => {
  res.send('Admin')
})

//Get Login page
router.get('/login',checkNotAuthenticated, async (req, res) => {
  res.render('login', {layout: './layouts/loginLayout.ejs'})
})

//Get Login page
router.get('/register',checkNotAuthenticated, async (req, res) => {
  res.render('register',{message: '', layout: './layouts/loginLayout.ejs'})
})

//Create new user
router.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      role: 'admin',
      password: hashedPassword
    })

    const newUser = await user.save()
    res.status(201).redirect('/login')
  } catch(err) {
    res.status(500).render('register', {message: err.message})
  }
})

//Login
router.post('/login',checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

//Logout
router.delete('/logout', async(req, res)=>{
  req.logOut()
  res.redirect('/login')
  // res.cookie('authorization', 'expired', {httpOnly: true})
})

//     //Create token
//     var token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, process.env.ACCES_TOKEN_SECRET, {
//     expiresIn: '20s' // expires in 24 hours
    

//Delete User
router.delete('/:id', checkAuthenticated, function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
      if (err) return res.status(500).send("There was a problem deleting the user.");
      res.status(200).send("User: "+ user.name +" was deleted.");
  });
});



module.exports = router