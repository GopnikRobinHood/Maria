const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/users')
const Car = require('../models/cars')
const initializePassport = require('../public/javascripts/passport-config')


initializePassport(
  passport,
  allUsers()
)

//Ich suche hier schon alle User, bekomme aber nur ein Promise
async function allUsers() {
  return await User.find({}).exec()
  }


router.get('/', async (req, res) => {
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
})

//Get Login page
router.get('/users/login', async (req, res) => {
  res.render('login.ejs')
})

//Create new user
router.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })

    const newUser = await user.save()
    res.status(201).send('User created')
  } catch(err) {
    res.status(500).send('Error on the server')
  }
})

//Login
router.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))


// router.post('/users/login', async (req, res) => {
//   try{

//     //Get user
//     const user = await User.findOne({email: req.body.email})

//     //Check if user is in db
//     if (!user) return res.status(404).send('No user found')

//     //Check if pw is right
//     var passwordIsValid = await bcrypt.compare(req.body.password, user.password)
//     if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })
      
//     // //Create token
//     // var token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, process.env.ACCES_TOKEN_SECRET, {
//     //   expiresIn: '20s' // expires in 24 hours
//     // });
    
//     res.status(200).send('OK')

//   }catch(err){
//     res.status(500).send(err)
//   }
// })


//Logout
router.delete('/users/logout', async(req, res)=>{
      
  
    //Send token
      res.cookie('authorization', 'expired', {httpOnly: true})
      res.redirect('/users/login')


      //req.logOut()
})


router.delete('/:id', function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
      if (err) return res.status(500).send("There was a problem deleting the user.");
      res.status(200).send("User: "+ user.name +" was deleted.");
  });
});


module.exports = router