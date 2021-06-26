const jwt = require('jsonwebtoken')

function authenticateToken (req, res, next) {
    const authHeader = req.cookies.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return  res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, user) =>{
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
  }

  module.exports = authenticateToken()



