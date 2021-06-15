const express = require('express')
const { readToken } = require('../config')
const router = express.Router()
const { userController } = require('../controller')

router.get('/get-all', userController.getUsers)
router.post('/regis', readToken, userController.addUsers)
router.post('/login', userController.login)
router.patch('/update/:id', readToken, userController.updatePegawai)
router.delete('/delete', readToken, userController.deleteUser)

module.exports = router
