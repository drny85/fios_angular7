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
    const referral = req.body.referral;

    let body = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Your Fios Specialist</title>
        
    </head>
    
    <body style="margin: 0;padding: 0;box-sizing: border-box;width: 100%;height: 100%;position: relative;">
        <div class="container" style="box-sizing: border-box;padding: 10px;min-width: 100%;min-height: 100%;max-width: 100%;max-height: 100%;position: relative;">
            <img src="cid:flyer" alt="flyer" style="width: 100%;height: 100%;">
    
            
    
        </div>
    
    
    </body>
    
    </html>
    `;
    User.findOne({
            _id: req.user._id
        })
        .then(user => {
            let n = user.name.toUpperCase();
            let l = user.last_name.toUpperCase();
            if (user) {
                return transporter.sendMail({
                    to: email,
                    from: `${n} ${l} ` + req.user.email,
                    cc: req.user.email,
                    subject: 'Your Personal Verizon Fios Specialist',

                    html: body,
                    attachments: [{
                        filename: 'netflix_promo.png',
                        path: path.join(__dirname, '../public/images/netflix_promo.png'),
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