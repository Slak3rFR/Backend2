const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('./models/User');
const { isValidPassword } = require('./utils');
const jwt = require('jsonwebtoken');

// Estrategia Local (login/register)
passport.use('login', new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            if (!isValidPassword(user, password)) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Estrategia JWT
const JWT_SECRET = 'tu_secreto_jwt'; // Cambia esto por una clave segura en producción
passport.use('jwt', new JWTStrategy(
    {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET
    },
    async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Serializar y deserializar usuario
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = { passport, JWT_SECRET };