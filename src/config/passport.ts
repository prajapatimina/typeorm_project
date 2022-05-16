import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

import * as passport from 'passport';
import * as passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;
import logger from '../logger/logger';

passport.serializeUser((user: User, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    const user = AppDataSource.getRepository(User).findBy(id);
    if (user) {
        return done(null, user);
    }
});

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        (email, password, done) => {
            AppDataSource.getRepository(User)
                .findOne({ where: { email } })
                .then((user) => {
                    if (!user) {
                        logger.error('Invalid user');
                        return done(null, false, {
                            errors: { 'email or password': 'is invalid' },
                        });
                    }

                    return done(null, user);
                })
                .catch(done);
        }
    )
);
