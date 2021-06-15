const express = require('express')
const app = express()
const PORT = 2023
const cors = require('cors')
const bearerToken = require('express-bearer-token')


app.use(cors())
app.use(bearerToken())
app.use(express.json())

const { db } = require('./config/database')

db.getConnection((err, connection) => {
    if (err) {
        return console.error('Error MySQL', err.message)
    }
    console.log(`Connected to MySQL Server: ${connection.threadId}`)
})

const { userRouter } = require('./router')
const { jobRouter } = require('./router')
app.use('/users', userRouter)
app.use('/job-task', jobRouter)


// ERROR HANDLING
app.use((error, req, res, next) => {
    console.log("Handling Error", error)
    res.status(500).send({ status: 'Error Mysql', message: error })
})


app.listen(PORT, () => console.log("Server Running:", PORT))