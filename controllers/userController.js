const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.sing_up = (req, res,next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {

            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail already exits'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {

                    if (err) {
                        res.status(500).json({ error: err })
                    } else {

                        const user = new User({
                            email: req.body.email,
                            password: hash
                        })

                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created'
                                })
                            })
                            .catch(err => res.status(500).json({ error: err }))
                    }

                })

            }

        })
        .catch(err => res.status(500).json({ error: err }))
}

exports.login = (req, res,next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.json({
                    status:401,
                    message: 'User doesn\'t exits'
                })
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {

                    if (err) {
                        console.log(err)
                        return res.json({
                            status:401,
                            message: 'Authentication failed'
                        })
                    }
                    if (result) {
                        const SECRET_KEY = "YOUR_SECURE_PASSWORD"
                        const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        }, SECRET_KEY, {
                                expiresIn: "1h"
                            })
                        return res.json({
                            status:200,
                            message: 'Authentication sucessfull',
                            token: token
                        })
                    }
                    return res.json({
                        status:401,
                        message: 'Password doesn\'t match'
                    })

                })
            }
        })
        .catch(err => res.status(500).json({ error: err }))
}