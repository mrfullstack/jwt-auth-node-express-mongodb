const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')

//port
const port = 4000

//importing user routes
const userRouter = require('./routes/userRoute')
const db = require('./configs/DB').MONGO_URI



//middleweres
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())

//using the route
app.use(userRouter)

//MONGo CONNECTION
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('DB connected')
    })
    .catch(err => console.log(err))
app.listen(port, () => {
    console.log(`Server running on ${port}`)
})