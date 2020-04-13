require('dotenv').config();
const jwt = require('jsonwebtoken');
const {user} = require('../models');
const helper = require('./helper');
var bcrypt = require('bcrypt-nodejs');

class User {

    static async addUser(userData) {
        let {email, password, firstName, lastName} = userData;

        try {
            let checkUserExists = await this.findByEmailAddress(email);

            if (checkUserExists === null) {
                let newUser = await user.create({email, password, firstName, lastName});

                if (newUser) {
                    let token = jwt.sign({
                        email: newUser.email,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName
                    }, process.env.PASSPORT_SECRET, {
                        expiresIn: 86400 * 30
                    })

                    return token;
                } else {
                    helper.sError();
                }

                return newUser;
            } else {
                return helper.createError(409, "A user with this email already exists");
            }
        } catch (error) {
            console.log("Error in adding user:", error.errors[0].message);
            if (error.errors) {
                return helper.createError(400, error.errors[0].message);
            } else {
                return helper.sError();
            }
        }
    }

    static async findByEmailAddress(email) {
        try {
            let userInfo = await user.findOne({where: {
                    email
                }, raw: true});

            return userInfo;
        } catch (error) {
            console.log("Error in finding email", error);
            return helper.sError();
        }
    }

    static async signInByEmailAndPassword(email, password) {
        try {
            let userInfo = await this.findByEmailAddress(email);

            if (userInfo === null) {
                return helper.createError(409, "Incorrect email and password")
            } else {
                let passwordMatch = bcrypt.compareSync(password, userInfo.password);

                if (passwordMatch) {
                    let token = jwt.sign({
                        email: userInfo.email,
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName
                    }, process.env.PASSPORT_SECRET, {
                        expiresIn: 86400 * 30
                    })

                    return token;
                } else {
                    return helper.createError(409, "Incorrect email and password")
                }
            }
        } catch (error) {
            console.log("Error in signing user via email and password", error);
            return helper.sError();
        }
    }

    static async verifyToken(headers) {
        try {
            let token = helper.getToken(headers);

            if (token !== null) {
                let verifiedToken = jwt.verify(token, process.env.PASSPORT_SECRET);

                if (verifiedToken) {
                    return {status: true}
                }
            } else {
                return helper.createError(401, 'Invalid token');
            }

        } catch (error) {
            console.log("Error in verifying token", error);
            return helper.createError(401, 'Invalid token');
        }
    }

}

module.exports = User;