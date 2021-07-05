exports.checkAuthenticated= function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
  
exports.checkNotAuthenticated= function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}


// exports.checkRole = function (role){
//   return async (req, res, next) => {
//     console.log(await req.user.role)
//     if(await req.user.role !== role){
//       res.status(401)
//       return res.send('Not allowed')
//     }
//     next()
//   }
// }