//jshint esversion:6
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    last_name: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true
    },
    roles: {
        isAdmin: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: false
        },
        coach: {
            type: Boolean,
            default: false
        },
    },
    created_on: {
        type: Date,
        default: Date.now
    },
    managers: {
        type: Schema.Types.Array,
        ref: 'Manager'
    },
    vendor: String,
    coach: {
        type: Schema.Types.ObjectId,
        ref: 'Coach'
    }


});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        roles: this.roles
    }, process.env.MY_JWT_PRIVATE_KEY, {
        expiresIn: '4hr'
    });

    return token;
}



module.exports = mongoose.model('User', userSchema);