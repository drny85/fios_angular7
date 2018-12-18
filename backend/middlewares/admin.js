const User = require('../models/user');
module.exports = function (req, res, next) {
    
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
    
}