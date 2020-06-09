
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')


signToken = (user) => {
  return jwt.sign({
    sub: user.id,
    iat: new Date().getTime(),
    iss: 'Guerrilla',
    exp: new Date().setDate(new Date().getDate() + 1)
  }, JWT_SECRET)
}

module.exports = {

  signUp: async (req, res, next) => {
    try {
      let { email, password } = req.value.body

      let userFound = await User.findOne({ where: { email } })
      if (userFound) {
        res.status(400).json({
          error: true,
          message: ['Email already registered'],
          data: []
        })
      }

      password = await User.hashPassword(password)
      const userSave = await User.create({ email, password })

      if (userSave) {

        const token = await signToken(userSave)

        res.status(200).json({
          message: ['User created successfully'],
          data: [{
            token: token
          }]
        })
      }

    } catch (error) {
      console.log(error)
    }
  },


  signIn: async (req, res, next) => {
    try {

      const token = await signToken(req.user)
      return res.status(200).json({
        message: ['User loggedin successfully'],
        data: [{
          token: token
        }]
      })
    } catch (error) {

    }
  },

  googleoauth: async (req, res, next) => {
    try {

      const token = await signToken(req.user)
      return res.status(200).json({
        message: ['User loggedin successfully'],
        data: [{
          token: token
        }]
      })
    } catch (error) {

    }
  },

  facebookoauth: async (req, res, next) => {
    try {

      const token = await signToken(req.user)
      return res.status(200).json({
        message: ['User loggedin successfully'],
        data: [{
          token: token
        }]
      })
    } catch (error) {

    }
  },


  secret: async (req, res, next) => {
    try {
      res.status(200).json({
        "user": "found"
      })
    } catch (error) {

    }
  }


}