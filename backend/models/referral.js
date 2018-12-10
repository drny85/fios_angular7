//jshint esversion:6
const mongoose = require('mongoose');
const Referee = require('./referee');

const Schema = mongoose.Schema;

const referralSchema = new Schema({
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
    address: Object,
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true
    },
    comment: String,
    status: {
        type: String,
        lowercase: true
    },
    moveIn: Date,
    due_date: Date,
    order_date: Date,
    package: String,
    mon: String,
    date_entered: {
        type: Date,
        default: Date.now
    },
    referralBy: {
        type: Schema.Types.ObjectId,
        ref: 'Referee'
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'Manager'
    }

});

module.exports = mongoose.model('Referral', referralSchema);