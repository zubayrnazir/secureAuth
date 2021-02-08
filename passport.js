const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const config = require('./config')
const User = require('./models/users')
const LocalStrategy = require('passport-local').Strategy
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const FacebookTokenStrategy = require('passport-facebook-token')


passport.use(new jwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.JWT_SECRET
}, async (payload, done) => {

  try {

    const userFound = await User.findByPk(payload.sub)
    if (!userFound) {
      return done(null, false)
    }

    done(null, userFound)

  } catch (error) {
    done(error, false)
  }

}))

passport.use(new LocalStrategy({
  usernameField: 'username'
}, async (username, password, done) => {

  try {
    const userFound = await User.findOne({ where: { email: username } })
    if (!userFound) {
      return done(null, false)
    }

    let matchPassword = await userFound.isValidPassword(password)
    if (!matchPassword) {
      return done(null, false)
    }

    done(null, userFound)
  } catch (error) {
    done(error, false)
  }

}))

passport.use('googleToken', new GooglePlusTokenStrategy({
  clientID: config.OAuth.Google.clientID,
  clientSecret: config.OAuth.Google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {

  console.log('accessToken', accessToken)
  console.log('refreshToken', refreshToken)
  console.log('profile', profile)

  const userExists = await User.findOne({ where: { oauthId: profile.id } })
  if (userExists) {
    return done(null, userExists)

  }

  const newUser = await User.create({
    method: 'Google',
    oauthId: profile.id,
    email: profile.emails[0].value
  })

  done(null, newUser)


}))


passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: config.OAuth.Facebook.clientID,
  clientSecret: config.OAuth.Facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {

  const userExists = await User.findOne({ where: { oauthId: profile.id } })
  if (userExists) {
    return done(null, userExists)

  }

  const newUser = await User.create({
    method: 'Facebook',
    oauthId: profile.id,
    email: profile.emails[0].value
  })

  done(null, newUser)


}))
