const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../../models/users')


async function initialize(passport, user) {
  //console.log(user)

  const authenticateUser = async (email, password, done, users) => {
    try{
      const users = await User.find({})
      const user = users.find(user => user.email === email)
      if (typeof user === 'undefined') return done(null, false, { message: 'No user with that email' })
      if (await bcrypt.compare(password, user.password)) {
          return done(null, user)  
        } else {
          return done(null, false, { message: 'Password incorrect' }) 
        }
    } catch(err) {
      console.log(err)
      return done(null, false, { message: 'Something went wrong!' }) 
    }
  }

  //desereializeUser ist garantiert falsch
  const findUserById = (id) => id
  
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => done(null, findUserById(id)))

}

module.exports = initialize