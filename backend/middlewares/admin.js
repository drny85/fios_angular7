const User = require('../models/user');
module.exports = function (req, res, next) {
<<<<<<< HEAD
    User.findById(req.user._id)
        .select('roles')
        .then(
            user => {

                if (!user.roles.isAdmin) return res.status(403).send('Access denied');

                next();
            }
        ).catch(err => {
            next(err)
        });


=======
    
    User.findById(req.user._id)
    .select('roles')
    .then(user => {
        console.log(user.roles);
    if (!user.roles.isAdmin) return res.status(403).send('Access denied');

    next();
    })
    .catch(err => {
        next(err);
    })
    
>>>>>>> 1a7a56059da9932ba4ca472cf4f38301b354f244
}