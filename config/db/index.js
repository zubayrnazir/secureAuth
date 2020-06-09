const Sequelize = require('sequelize')



let config = require('./connection').local
let logging = console.log

const sequelize = module.exports = new Sequelize(config.database, config.username, config.password, {
  logging: logging,
  host: config.host,
  dialect: 'mysql',
  timezone: '+04:00',
  operatorsAliases: Sequelize.Op,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

sequelize
  .authenticate()
  .then(() => {
    console.log('DatabaseConnection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

sequelize.sync({
  force: false
})