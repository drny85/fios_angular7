module.exports = function (req, res, next) {

    if (!req.user.roles.coach) return res.status(403).send('Access denied');

    next();
}