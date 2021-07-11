const User = require('../../models/users')
const { ROLE, users } = require('../javascripts/userData')

function authRole (role){ 
    return async (req, res, next) => {
      const id = req.session.passport.user
      const allUsers = await User.find({}) 
      //need to load user data like this, else new users are not yet available
      const user = allUsers.find(user => user.id === id)
      if(user.role == ROLE.ADMIN){
        req.showAdmin = true
      } else {
        req.showAdmin = false
      }


    if (role==null) {
        return next()
    } else {
        if(role !== user.role){
            return res.status(401).render('error.ejs',{message: 'Permission denied!'})
          }
          next()
        }
    }
  }


  module.exports = authRole