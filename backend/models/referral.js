//jshint esversion:6
const mongoose = require('mongoose');
const Referee= require('./referee');

const Schema = mongoose.Schema;

const referralSchema = new Schema({
    name: { type: String, required: true, lowercase: true},
    last_name: { type: String, required: true, lowercase: true},
    address: Object,
    phone: {type: String, required: true},
    email: {type: String, lowercase: true},
    comment: String,
    status: {type: String, lowercase: true},
    moveIn: String,
    due_date: String,
    order_date: String,
    package: String,
    mon: String,
    date_entered: {type: Date, default: Date.now},
    referralBy: { type: Schema.Types.ObjectId, ref: 'Referee'}
    
});

module.exports = mongoose.model('Referral', referralSchema);