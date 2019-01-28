const nodemailer = require('nodemailer');
const transport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const path = require('path');

const transporter = nodemailer.createTransport(transport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY

    }
}));

exports.sendFlyer = (req, res, next) => {

    const email = req.body.email;

    let body = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Flyer</title>
        <style>
            .card {
    
    
                align-content: center;
                align-items: center;
                top: 0;
                margin: 0 auto;
                max-width: 768px;
                border: 1px solid rgb(236, 226, 226);
                border-radius: 5px;
                min-width: 568px;
            }
    
            .card-body {
                z-index: 100;
                width: 100%;
                position: relative;
    
                margin: 0 auto;
    
    
            }
    
    
            .card-title {
                text-align: left;
                font-size: 1.5rem;
                margin-left: 1rem;
                position: relative;
            }
    
            .card-title p {
                font-style: italic;
                font-size: 20px !important;
                padding: 12px;
            }
    
    
            .btn {
                border: none;
                width: 10rem;
                padding: 1rem 2rem 1rem 2rem;
                border-radius: 30px;
                margin: 1rem;
    
            }
    
            .card .logo_image {
                width: 100%;
                height: 100%;
                padding: 1rem;
            }
    
            .row {
                width: 100%;
                position: relative;
                max-height: 400px;
                min-height: 400px;
                min-width: 738px;
            }
    
            .col-6 {
                position: absolute;
                top: 0;
                left: 0;
            }
    
            .fl {
                float: left;
                position: relative;
            }
    
            .fr {
                float: right;
                position: relative;
            }
    
            .profile_pic img {
                width: 100%;
                max-height: 400px;
                padding: 0;
                position: relative;
            }
    
            .card-btn a {
                position: relative;
                text-decoration: none;
                text-align: center;
    
    
            }
    
    
            .card-btn a:hover {
                background-color: rgb(109, 107, 103);
    
            }
    
            .black {
                background-color: black;
                color: whitesmoke;
            }
    
            .container {
                width: 100%;
                position: relative;
                top: 2rem;
                margin: 0 auto;
                min-width: 578px;
            }
    
            .card-btn {
                position: relative;
                margin: 0 auto;
    
    
            }
    
            .card img {
                text-align: center;
            }
    
            body {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
        </style>
    </head>
    
    <body style="margin: 0;padding: 0;box-sizing: border-box;">
        <div class="container" style="width: 100%;position: relative;top: 2rem;margin: 0 auto;min-width: 700px;">
            <div class="card profile_pic row" style="align-content: center;align-items: center;top: 0;margin: 0 auto;max-width: 768px;border: 1px solid rgb(236, 226, 226);border-radius: 5px;min-width: 738px;width: 100%;position: relative;max-height: 400px;min-height: 400px;">
                <div class="card-title col-6 fl" style="text-align: left;font-size: 1.5rem;margin-left: 1rem;position: relative;top: 0;left: 0;float: left;">
                    <h3>Robert Melendez</h3>
                    <p style="font-style: italic;padding: 12px;font-size: 20px !important;">Your building's dedicated Fios rep</p>
                    <div class="card-btn" style="position: relative;margin: 0 auto;">
    
                        <!-- <a href="tel:646-574-0089" class="btn black mobile_only">Call me</a> -->
                        <a href="mailto:robert.melendez@drascosales.com" class="btn black desktop_only" style="border: none;width: 10rem;padding: 1rem 2rem 1rem 2rem;border-radius: 30px;margin: 1rem;background-color: black;color: whitesmoke;position: relative;text-decoration: none;text-align: center;">Email me</a>
    
                    </div>
                </div>
                <div class="img_div col-6 fr" style="position: relative;top: 0;left: 0;float: right;">
                    <img src="https://d1v58eqpqo0kww.cloudfront.net/A5F1EE1D37/image/1nPAbyDRxXw38r09nqJENZ6BmWvaeJOM_large.png" alt="image" style="width: 100%;max-height: 400px;padding: 0;position: relative;text-align: center;">
                </div>
    
            </div>
            <div class="card" style="align-content: center;align-items: center;top: 0;margin: 0 auto;max-width: 768px;border: 1px solid rgb(236, 226, 226);border-radius: 5px;min-width: 568px;">'
                <img class="logo_image" src="cid:flyer" alt="flyer" style="text-align: center;width: 100%;height: 100%;padding: 1rem;">
    
            </div>
        </div>
    
    </body>
    
    </html>
    `;
    User.findOne({
            _id: req.user._id
        })
        .then(user => {
            if (user) {
                return transporter.sendMail({
                    to: email,
                    from: req.user.email,
                    cc: req.user.email,
                    subject: 'Your Personal Verizon Fios Specialist',


                    html: body,
                    attachments: [{
                        filename: 'flyer.jpg',
                        path: path.join(__dirname, '../public/images/flyer.jpg'),
                        cid: 'flyer'
                    }],
                }, (err, info) => {
                    console.log(err);
                    if (info) {
                        res.status(200).json({
                            message: 'Email Sent.'
                        });
                    } else {
                        res.status(404).json(new Error('Something went wrong'));
                    }
                })

            }
        })
        .catch(error => next(error));



}