const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('./models/User');
const { isValidPassword } = require('./utils');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./config/env');

const authMiddleware = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'No autorizado' });
        req.user = user;
        next();
    })(req, res, next);
};

const authorizationMiddleware = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
};

passport.use('login', new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: 'Usuario no encontrado' });
            if (!isValidPassword(user, password)) return done(null, false, { message: 'Contraseña incorrecta' });
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.use('jwt', new JWTStrategy(
    {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSecret
    },
    async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (!user) return done(null, false, { message: 'Usuario no encontrado' });
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

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

module.exports = { passport, authMiddleware, authorizationMiddleware };