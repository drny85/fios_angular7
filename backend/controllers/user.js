const User = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const {
    validationResult
} = require('express-validator/check');


exports.createUser = (req, res, next) => {

    const body = _.pick(req.body, ['name', 'last_name', 'phone', 'email', 'password', 'password1']);


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

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
                            return
                        })
                })
            })

        })
        .catch(err => console.log(err));



}

exports.loginUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({msg: 'invalid email or password'});
    }

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
                    user: _.pick(user, ['_id', 'name', 'email', 'roles'])
                });
            })
        }).catch(err => console.Console(err));

}

exports.getUser = (req, res, next) => {
    const userId = req.user._id;
    User.findById(userId)
        .populate('coach', 'name last_name email')
        .select('-password')
        .exec()
        .then(user => {

            res.json({
                user: user
            });
        })


}

exports.getUserById = (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
        .select('-password')
        .populate('coach', 'email name last_name')
        .exec()
        .then(user => {
            res.json(user)
        }).catch(err => console.log(err));
}


exports.getAllUsers = (req, res, next) => {
    if (req.user.roles.isAdmin) {
        User.find()
            .select('-password')
            .populate('coach', 'name last_name email')
            .exec()
            .then(users => {
                res.json(users);
            }).catch(err => {
                console.log(err);
            })
    } else if (req.user.roles.coach) {
        User.find({
                coach: {
                    _id: req.user._id
                }
            })
            .select('-password')
            .populate('coach', 'name last_name email')
            .exec()
            .then(users => {
                res.json(users);
            }).catch(err => {
                console.log(err);
            })
    }

}

exports.updateUser = (req, res, next) => {
    const id = req.body._id;
    const user = req.body;
    // let profileCompleted = false;
    // if (user.coach && user.vendor) {
    //     profileCompleted = true;
    // }

    User.findOneAndUpdate({
            _id: id
        }, { ...user

        }, {
            new: true
        })
        .populate('coach', 'name last_name email')
        .populate('manager', 'name last_name email')
        .exec()
        .then(user => {

            res.json(user);
        })
        .catch(err => console.log(err));
}

exports.deleteUser = (req, res, next) => {
    const userId = req.params.id;
    User.findOne({
            _id: id
        })
        .then(u => {
            if (!u) return res.status(400).json({
                message: 'Not user found'
            });

            res.json(u);
        })
        .catch(err => console.log(err));
}

exports.getCoaches = (req, res, next) => {
    const id = req.user._id;
    User.find()
        .select('-password')
        .then(coach => {

                if (!coach) return res.status(400).json({
                    message: 'Not coaches found'
                });

                coach = coach.filter(u => u.roles.coach);
                res.json(coach);
            }

        ).catch(err => next(err))



}