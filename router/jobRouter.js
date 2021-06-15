const express = require('express')
const { readToken } = require('../config')
const router = express.Router()
const { jobController } = require('../controller')

router.post('/add', readToken, jobController.addJobTask)
router.get('/get-jt', jobController.getJobtask) // Get All
router.patch('/update/:id', readToken, jobController.updateJt)
router.delete('/delete/:id', readToken, jobController.deleteJt)
router.get('/get-all', readToken, jobController.getAll)
router.get('/get-posisi/:id', jobController.getposisi)

module.exports = router
