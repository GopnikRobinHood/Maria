const express = require('express')
const router = express.Router()
const authenticate = require('../public/javascripts/checkAuthenticated')

const { encrypt, decrypt } = require('../public/javascripts/crypto');
const Log = require('../models/log')

const checkAuthenticated = authenticate.checkAuthenticated
const authRole = require('../public/javascripts/authRole')
const { ROLE, users } = require('../public/javascripts/userData')

//Get Admin page
router.get('/',checkAuthenticated, authRole(ROLE.ADMIN), async (req, res) => {
    res.render('Admin')
  })

//Get all Logs
router.get('/logs', checkAuthenticated,authRole(ROLE.ADMIN), async (req,res) => {
    try{
        const logs = await Log.find({})
        res.send(logs)
    } catch(err){
        res.send('Error: ' + err)
    }
})


//Does not work yet
router.delete('/:id', checkAuthenticated,authRole(ROLE.ADMIN), async (req,res) => {
    let log
    try{
        log = await Log.findById(req.params.id)
        await log.remove()
        res.send('Log removed')
    } catch(err){
        res.send('Error: ' + err)
    }
})

module.exports = router