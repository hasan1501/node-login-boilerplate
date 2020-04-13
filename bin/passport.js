require('dotenv').config()
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
const User = require('../controllers/user');

module.exports = function (passport) {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
        secretOrKey: process.env.PASSPORT_SECRET
    };
    passport.use('jwt', new JwtStrategy(opts, async function (jwt_payload, done) {
        let userInfo = await User.findByEmailAddress(jwt_payload.email);

        if (userInfo !== null) {
            return done(null, userInfo);
        } else {
            let err = new Error('User not found');
            return done(err, false);
        }
    }));
};