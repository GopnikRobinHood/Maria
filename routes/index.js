const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const passport = require('passport')
const User = require('../models/users')
const Car = require('../models/cars')
const Log = require('../models/log')

const initializePassport = require('../public/javascripts/passport-config')
const authenticate = require('../public/javascripts/checkAuthenticated')
const checkAuthenticated = authenticate.checkAuthenticated
const checkNotAuthenticated = authenticate.checkNotAuthenticated
const authRole = require('../public/javascripts/authRole')
const { encrypt, decrypt } = require('../public/javascripts/crypto');

//users is not needed
const { ROLE, users } = require('../public/javascripts/userData')


initializePassport(
  passport
)


router.get('/',checkAuthenticated, authRole(null), async (req, res) => {
  showAdmin = req.showAdmin
  let cars
  try{
    cars = await Car.find().sort({ createdAt: 'desc'}).limit(3).exec()
  } catch {
    cars = []
  }
  res.render('index', {cars: cars, user: await req.user, showAdmin : showAdmin})
})


//Get all users
router.get('/users',checkAuthenticated, authRole(ROLE.ADMIN), async (req, res) => {
  const users = await User.find({})
  res.send(users)
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
      role: 'basic',
      password: hashedPassword,
      source: req.headers['x-forwarded-for'] || req.socket.remoteAddress
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

//Successful login to get user role and track activity
//Does not work on Heroku
router.get('/redirect',checkAuthenticated, async (req,res) => {
  
  const id = req.session.passport.user
  const allUsers = await User.find({})
  const user = allUsers.find(user => user.id === id)

  const log = new Log({
    source: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userId: user.id,
    userName: user.name,
    action: 'Logging-In',
    name: user.name,
  })
  const newLog = await log.save()
  //it would be useful to get the user role here (user.role == ROLE.ADMIN)
  res.redirect('/')
})

//Logout
router.delete('/logout', async(req, res)=>{
  req.logOut()
  res.redirect('/login')
})

//     //Create token
//     var token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, process.env.ACCES_TOKEN_SECRET, {expiresIn: '20s'})
    

//Delete User
router.delete('/:id', checkAuthenticated, function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
      if (err) return res.status(500).send("There was a problem deleting the user.");
      res.status(200).send("User: "+ user.name +" was deleted.");
  });
});



module.exports = router