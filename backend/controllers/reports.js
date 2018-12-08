//jshint esversion:6
exports.reports = (req, res, next) => {
  let title = 'Reports'
  let path = 'reports'
  res.render('reports/reports', { title: title, path: path })
}
