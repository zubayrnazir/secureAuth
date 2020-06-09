'use strict'
const sequelize = require('sequelize')
const sequelizeConfig = require('../config/db')
const bcrypt = require('bcrypt')

const User = sequelizeConfig.define('User', {
  id: {
    type: sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  method: {
    type: sequelize.ENUM,
    values: ['Local', 'Google', 'Facebook']
  },
  oauthId: {
    type: sequelize.STRING
  },
  email: { // alphanumeric
    type: sequelize.STRING,
    unique: true
  },
  password: {
    type: sequelize.TEXT,
    validate: {
      len: {
        args: [8],
        msg: 'password must be of length 8 or greater'
      }
    }
  }
})

User.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

User.prototype.isValidPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

module.exports = User