const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../../models/users')

function initialize(passport, getAllUsers) {
  const authenticateUser = async (email, password, done) => {
    const users = getAllUsers
    const user = users.then(async function(result) {
        const user = result.find(user => user.email === email)
        console.log(user)
        if (typeof user === 'undefined') return done(null, false, { message: 'No user with that email' })

         try {
         if (await bcrypt.compare(password, user.password)) {
             return done(null, user)    
            //console.log('Password correct')
          } else {
            return done(null, false, { message: 'Password incorrect' }) 
            //console.log('Password incorrect')
          }
         }catch(err){
            console.log(err)
         }
      }).catch(err => {
        console.log(err)
      })
   }
   //console.log(user)
   passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
   //passport.serializeUser((user, done) => done(null, user.id))
   //passport.deserializeUser((id, done) => done(null, getUserById(id))
}

module.exports = initialize