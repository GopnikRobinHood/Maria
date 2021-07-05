const User = require('../../models/users')

const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
}

async function Users(){
    const users = await User.find({})
    return users
  }

const users = Users()

module.exports = {
    ROLE : ROLE,
    users : users
}