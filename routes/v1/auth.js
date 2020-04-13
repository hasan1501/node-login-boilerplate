require('dotenv').config();
var router = require('express').Router();
const User = require('../../controllers/user');

router.post('/login', async function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;

    try {
        let userInfo = await User.signInByEmailAndPassword(email, password);

        if (userInfo.error) {
            var err = new Error(userInfo.error.message);
            err.status = userInfo.error.statusCode;
            next(err);
        } else {
            res
                .status(200)
                .json({token: `JWT ${userInfo}`})
        }

    } catch (error) {
        console.log("Error in signing in user", error);
        var err = new Error('Something went wrong');
        err.status = 400;
        next(err);
    }
})

router.post('/register', async function (req, res, next) {

    try {
        let newUser = await User.addUser(req.body);

        if (newUser.error) {
            var err = new Error(newUser.error.message);
            err.status = newUser.error.statusCode;
            next(err);
        } else {
            res
                .status(200)
                .json({token: `JWT ${newUser}`})
        }
    } catch (error) {
        console.log("Error in registering user", error);
        var err = new Error('Something went wrong');
        err.status = 400;
        next(err);
    }
})

router.get('/verify', async function (req, res, next) {

    try {
        let status = await User.verifyToken(req.headers);

        if (status.error) {
            var err = new Error(status.error.message);
            err.status = status.error.statusCode;
            next(err);
        } else {
            res
                .status(200)
                .json(status)
        }
    } catch (error) {
        console.log("Error in verifying token", error);
        var err = new Error('Something went wrong');
        err.status = 400;
        next(err);
    }
})

module.exports = router;