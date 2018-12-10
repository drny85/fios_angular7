//jshint esversion:6
const Manager = require('../models/manager');
// const nodemailer = require('nodemailer');
// const transport = require('nodemailer-sendgrid-transport');
const _ = require('lodash');

// const transporter = nodemailer.createTransport(transport({
//   auth: {
//     api_key: process.env.SENDGRID_API_KEY

//   }
// }));



exports.getManagers = (req, res, next) => {

    Manager.find()
        .then(managers => {
            res.json({
                managers
            });

        })
        .catch(err => console.log(err));
}

//post Referee or referee
exports.postManager = (req, res, next) => {
    const name = req.body.name;
    const last_name = req.body.last_name;
    const phone = req.body.phone;
    const email = req.body.email;



    Manager.findOne({
            name: name,
            last_name: last_name
        })
        .then(result => {
            if (result) {

                res.status(400).json({
                    message: "Already register"
                });

            } else {
                const manager = new Manager({
                    name: name,
                    last_name: last_name,
                    phone: phone,
                    email: email

                })
                manager.save()
                    .then((manager) => {
                        res.json(manager)
                    })
            }
        }).catch(err => console.log(err));


}

exports.getOneManager = (req, res, next) => {

    const id = req.params.id;
    Manager.findOne({
            _id: id
        })
        .then(manager => {

            res.json({
                manager
            });

        })
        .catch(err => console.log(err));
}


//post update referre page

exports.postUpdateManager = (req, res) => {
    const id = req.params.id;
    // const title = "Update Referee";
    // const path = 'update referee';
    const body = _.pick(req.body, ['name', 'last_name', 'email', 'phone']);

    Manager.findByIdAndUpdate(id, body, {
            new: true
        })
        .then(manager => {
            res.json(manager);
        })
        .catch(err => console.log(err.message));


}

exports.deleteManager = (req, res) => {
    const id = req.params.id;
    Manager.findOneAndDelete({
            _id: id
        })
        .then(res => {
            res.json(res);
        })

}