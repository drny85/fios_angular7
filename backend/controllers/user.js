const User = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) => {

    const body = _.pick(req.body, ['name', 'last_name', 'phone', 'email', 'password']);
    User.findOne({
            email: body.email
        })
        .then(user => {
            if (user) {
                return res.status(400).json({
                    message: 'User already registered'
                })
            }
            //encrypt pawword / hash password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(body.password, salt, (err, hashed) => {
                    const newUser = new User(body);
                    newUser.password = hashed;
                    return newUser.save()
                        .then(user => {
                            const token = user.generateAuthToken();
                            user.token = token;
                            res.header('x-auth-token', token).json({
                                message: 'New user created',
                                user: _.pick(user, ['name', 'email', '_id'])
                            });
                        })
                })
            })

        })
        .catch(err => console.log(err));



}

exports.loginUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
            email: email
        })
        .then(user => {
            if (!user) return res.status(400).json({
                message: 'Not User Found',
                error: true
            });

            bcrypt.compare(password, user.password, (err, matched) => {

                if (!matched) return res.status(400).json({
                    message: 'Invalid email or password'
                });

                const token = user.generateAuthToken();
                // const decoded = jwt.decode(token);
                // req.user = decoded;

                res.header('x-auth-token', token).json({
                    message: 'Success',
                    token,
                    user: _.pick(user, ['_id', 'name', 'email'])
                });
            })
        })

}

exports.getUser = (req, res, next) => {
    const userId = req.user._id;
    User.findById(userId)
        .select('-password')
        .then(user => {

            res.json({
                user: user
            });
        })


}

exports.getUserById = (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
        .then(user => {
            res.json(user)
        }).catch(err => console.log(err));
}


exports.getAllUsers = (req, res, next) => {
    User.find()
        .select('-password')
        .then(users => {
            res.json(users);
        }).catch(err => {
            console.log(err);
        })
}

exports.updateUser = (req, res, next) => {
    const id = req.body._id;
    const user = req.body;
    User.findByIdAndUpdate(id, user, {
            new: true
        })
        .then(user => {
            res.json(user);
        })
        .catch(err => console.log(err));
}