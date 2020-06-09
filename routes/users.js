var express = require('express');
var router = module.exports = express.Router();
const UserController = require('./../controllers/users')
const { schemas, validateBody } = require('../helpers/routeHelpers')
const passport = require('passport')
const passportConf = require('../passport')
const passportSignin = passport.authenticate('local', { session: false })
const passportJWT = passport.authenticate('jwt', { session: false })
const passportGoogle = passport.authenticate('googleToken', { session: false })
const passportFacebook = passport.authenticate('facebookToken', { session: false })


/* GET users listing. */

router.route('/signIn').post(validateBody(schemas.authSchema), passportSignin, UserController.signIn)

router.route('/signUp').post(validateBody(schemas.authSchema), UserController.signUp)

router.route('/secret').get(passportJWT, UserController.secret)

router.route('/oauth/google').post(passportGoogle, UserController.googleoauth)

router.route('/oauth/facebook').post(passportFacebook, UserController.facebookoauth)


// router.get('/', function (req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
