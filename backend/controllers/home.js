//jshint esversion:6

exports.index = (req, res, next) => {
    let title = 'Welcome Page'
    let path = 'home'
    res.render('home/index', {title: title, path: path});
}

exports.mainPage = (req, res, next) => {
    let title = 'Main Page'
    let path = 'home'
    res.render('home/main', {title: title, path: path});
}



