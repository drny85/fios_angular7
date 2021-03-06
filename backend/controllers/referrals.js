//jshint esversion:6
const Referral = require( '../models/referral' );
const Referee = require( '../models/referee' );
const nodemailer = require( 'nodemailer' );
const User = require( '../models/user' );
var moment = require( 'moment-timezone' );
moment().tz( "America/New_York" ).format();

const transport = require( 'nodemailer-sendgrid-transport' );

const transporter = nodemailer.createTransport( transport( {
  auth: {
    api_key: process.env.SENDGRID_API_KEY

  }
} ) );

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {

//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PSW

//   }
// });

exports.getReferrals = ( req, res, next ) => {
  if ( req.user.roles.isAdmin && req.user.roles.active ) {

    Referral.find()
      .populate( 'referralBy', 'name last_name' )
      .populate( 'manager', 'email name last_name' )
      .populate( 'updatedBy', 'name last_name' )
      .sort( 'moveIn' )
      .exec()
      .then( referrals => {
        referrals = [ ...referrals ];
        res.status( 200 ).json( referrals );
        // res.render('referrals/referrals', { title: title, referrals: referrals, path: path});
      } )
      .catch( err => console.log( err ) );

  } else if ( req.user.roles.coach && req.user.roles.active ) {

    Referral.find( {
        coach: {
          _id: req.user._id
        }
      } )
      .populate( 'referralBy', 'name last_name' )
      .populate( 'manager', 'email name last_name' )
      .populate( 'updatedBy', 'name last_name' )
      .sort( 'moveIn' )
      .exec()
      .then( referrals => {
        referrals = [ ...referrals ];
        res.status( 200 ).json( referrals );
        // res.render('referrals/referrals', { title: title, referrals: referrals, path: path});
      } )
      .catch( err => console.log( err ) );

  } else if ( req.user.roles.active ) {

    Referral.find( {
        userId: req.user._id
      } )
      .populate( 'referralBy' )
      .populate( 'manager' )
      .populate( 'updatedBy' )
      .populate( 'coach', 'name last_name email' )
      .sort( 'moveIn' )
      .exec()
      .then( referrals => {

        referrals = [ ...referrals ];
        res.status( 200 ).json( referrals );
        // res.render('referrals/referrals', { title: title, referrals: referrals, path: path});
      } )
      .catch( err => console.log( err ) );
  }


};

exports.getReferral = ( req, res, next ) => {
  const id = req.params.id;
  Referral.findById( id )
    .populate( 'referralBy', 'name last_name _id' )
    .populate( 'manager', 'email name last_name' )
    .populate( 'updatedBy', 'name last_name' )
    .populate( 'coach', 'name last_name email' )
    .populate( 'userId', 'name last_name email' )
    .exec()
    .then( referral => {

      return res.status( 200 ).json( referral );
      // res.render('referrals/referral-detail', { referral: referral, title: title, path: path});
    } ).catch( err => console.log( err ) );
};

//add a referral page
exports.getAddReferral = ( req, res, next ) => {
  let title = 'Adding referral';
  let path = 'add-referral';
  let refereesArray = [];
  Referee.find()
    .then( referees => {
      refereesArray = [ ...referees ];
      res.render( 'referrals/add-referral', {
        title: title,
        path: path,
        referees: refereesArray
      } );
    } )

};

// editing a referral 
exports.editReferral = ( req, res, next ) => {
  const id = req.params.id;
  Referral.findOne( {
      _id: id
    } )
    .then( referral => {
      return res.json( referral );

    } )
    .catch( err => console.log( err ) );
};

//update referral
exports.updateReferral = ( req, res, next ) => {

  const id = req.params.id;
  let name = req.body.name;
  let last_name = req.body.last_name;

  let address = req.body.address;
  let apt = req.body.apt;
  let city = req.body.city;
  let zipcode = req.body.zipcode;

  const email = req.body.email;
  const phone = req.body.phone;
  let referralBy = req.body.referralBy;
  const comment = req.body.comment;
  const status = req.body.status;
  let moveIn = req.body.moveIn;
  const mon = req.body.mon;
  let due_date = req.body.due_date;
  let order_date = req.body.order_date;
  const package = req.body.package;
  const manager = req.body.manager;
  const coach = req.body.coach;
  const updated = req.body.updated;
  let referee;
  let email_sent = req.body.email_sent;




  Referral.findOneAndUpdate( {
      _id: id
    }, {
      name: name,
      last_name: last_name,
      address: address,
      apt: apt,
      city: city,
      zipcode: zipcode,
      email: email,
      phone: phone,
      comment: comment,
      referralBy: referralBy,
      status: status,
      due_date: due_date,
      order_date: order_date,
      package: package,
      mon: mon,
      moveIn: moveIn,
      manager: manager,
      coach: coach,
      updated: updated,
      updatedBy: req.user._id
    }, {
      new: true
    } )
    .populate( 'referralBy', 'name last_name' )
    .populate( 'manager', 'email name last_name' )
    .populate( 'updatedBy', 'name last_name' )
    .populate( 'coach', 'name last_name email' )
    .exec()
    .then( referral => {
      referee = `${referral.referralBy.name} ${referral.referralBy.last_name}`;

      res.json( referral );
      if ( status.toLowerCase() === 'closed' && !email_sent ) {
        name = name.toUpperCase();
        due_date = moment( due_date ).format( "L" );
        moveIn = moment( moveIn ).format( "L" );
        order_date = moment( order_date ).format( "L" );
        last_name = last_name.toUpperCase();
        from = req.user.email;
        let to = [ referral.manager.email ];
        let cc = [ referral.coach.email, req.user.email ];

        return transporter.sendMail( {
          to: to,
          from: from,
          cc: cc,
          subject: `Referral/Sale Closed Notification!`,
          html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
             <!--Import Google Icon Font-->
              <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
                <!--Import materialize.css-->
          
                 <!--Let browser know website is optimized for mobile-->
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title></title>
        </head>
        <body>
        <div class="container" style="margin: 0 auto;width: 100%;">
            <div class="card" style="-webkit-box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);-moz-box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);background: #fff;">
                <div class="card-title">
                    <h3 class="center" style="text-align: center;font-family: sans-serif;font-size: 1.7rem;text-transform: capitalize;">This referral has been closed</h3>
                    <div class="main_body" style="padding: 1rem;background: rgba(248, 246, 246, 0.541);">
                        <h2 class="center pd" style="text-align: center;padding: 10px; text-transform: capitalize;">${name} ${last_name}</h2>
                        <ul style="margin: 0 auto;">
                            <li style="text-decoration: none;list-style: none;padding: 0.8rem; text-transform: uppercase; margin: 0 auto;font-weight: bolder;">MON: ${mon}</li>
                            <li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto;">Due Date: ${due_date}</li>
                            <li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto;">Date Placed: ${order_date}</li>
                            <li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto; text-transform: capitalize;">Address: ${address}</li>
                            <li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto; text-transform: capitalize;">Package: ${package}</li>
                            <li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto;text-transform: uppercase;">Apt: ${apt}</li>
                            <li style="text-decoration: none; text-transform: capitalize; list-style: none;padding: 0.8rem;margin: 0 auto;">City: ${city}</li>
                            <li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto;">Phone: ${phone}</li>
                            <li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto;">Email: ${email}</li>
                            <li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto;">Move In: ${moveIn}</li>
                            <li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto; text-transform: capitalize;">Referral By: ${referee}</li>
                            <li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto; text-transform: capitalize;">Status: ${status}</li>
                        </ul>
    
                    </div>
                    <div class="comment card" style="-webkit-box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);-moz-box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);background: rgb(158, 158, 158);padding: 1rem;">
                        <h3>Commets or Notes:</h3>
                        <p style="text-align: left;font-size: 1.1rem;padding: 10px;line-height: 1.5;">
                        ${comment}
                            </p>
                    </div>
                </div>
    
            </div>
        </div>
    
    </body>
        </html>
        `

        }, ( err, info ) => {
          if ( !err ) {
            Referral.findOneAndUpdate( {
                _id: id
              }, {
                email_sent: true
              }, {
                new: true
              } )
              .then( ref => res.json( ref ) )
          }
        } )

      }
    } )
    .catch( err => console.log( err ) );

}


//delete referral
exports.deleteReferral = ( req, res, next ) => {
  const id = req.params.id;
  Referral.findOneAndRemove( {
      _id: id,
      userId: req.user._id
    } )
    .populate( 'referralBy', 'name last_name' )
    .then( ( ref ) => {
      if ( !ref ) return res.status( 401 ).json( {
        message: 'Can not delete this referral'
      } );


      res.json( {
        message: 'Referral Deleted!'
      } );
    } )
    .catch( err => console.log( err ) );
}

//adding the referral handler page
exports.addReferral = ( req, res, next ) => {
  const name = req.body.name;
  const last_name = req.body.last_name;
  let address = req.body.address;
  let apt = req.body.apt;
  let city = req.body.city;
  let zipcode = req.body.zipcode;
  const email = req.body.email;
  const phone = req.body.phone;
  let referralBy = req.body.referralBy;
  const comment = req.body.comment;
  const status = req.body.status;
  const moveIn = req.body.moveIn;

  let coach;
  let userId;
  if ( !req.body.userId ) {
    //the coach is submitting the referral.
    userId = req.body.userId;
    coach = req.user._id;
  } else {
    //logging using submitting the referral.
    User.findOne( {
        _id: req.user._id
      } )
      .then( u => {
        //if no user found.
        if ( !u ) return res.status( 404 ).json( new Error( 'No user found' ) );
        userId = u._id;
        coach = u.coach._id;
        const manager = req.body.manager;

        const referral = new Referral( {
          name: name,
          last_name: last_name,
          address: address,
          apt: apt,
          city: city,
          zipcode: zipcode,
          email: email,
          phone: phone,
          comment: comment,
          referralBy: referralBy,
          status: status,
          moveIn: moveIn,
          userId: userId,
          coach: coach,
          manager: manager

        } );
        referral.save()
          .then( result => {
            res.json( result );
            return Referee.findById( referralBy )
          } ).then( ref => {

            ref.referrals.push( referral._id );
            ref.save();
          } )
      } )
      .catch( error => next( error ) );


  };

}


exports.getAllReferralsById = ( req, res ) => {
  const id = req.params.id;

  Referral.find( {
      referralBy: id
    } )
    .populate( 'referralBy', 'name last_name' )
    .sort( 'moveIn' )
    .exec()
    .then( referrals => {

      res.json( referrals );

    } )
    .catch( err => console.log( err ) );
}




exports.getReferralsStatus = ( req, res ) => {
  let status = req.params.status;
  let statusRequested = status;

  if ( statusRequested === 'not%20sold' ) {
    statusRequested = 'not sold';
  } else if ( statusRequested === 'in%20progress' ) {
    statusRequested = 'in progress';
  }

  const title = 'My Referrals';
  const path = 'my referrals';
  if ( statusRequested !== 'all' ) {
    Referral.find( {
        status: statusRequested
      } )
      .sort( '-moveIn' )
      .exec()
      .then( referrals => {

        referrals = [ ...referrals ];
        res.json( referrals );

        // res.render('referrals/my-referrals', {
        //   referrals: referrals,
        //   title: title,
        //   path: path,
        //   status: statusRequested
        // });
      } )
      .catch( err => console.log( err ) );
  } else {
    Referral.find()
      .sort( '-moveIn' )
      .exec()
      .then( referrals => {
        referrals = [ ...referrals ];
        res.json( referrals );

      } )
      .catch( err => console.log( err ) );

  }
}

exports.getReferraslByDate = ( req, res, next ) => {
  const today = new Date().toLocaleDateString();
  const startDay = req.body.start;
  const endDay = req.body.end;

  let start = moment( startDay ).startOf( 'day' );
  // end today

  let end = moment( endDay ).endOf( 'day' );


  Referral.find( {
      order_date: {
        $gte: start,
        $lt: end
      },
      userId: req.user._id
    } )
    .then( referrals => {
      res.json( referrals );
    } )
    .catch( err => next( err ) );
}