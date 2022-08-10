exports.logout_get = function(req, res) {
  req.session.destroy();
  res.redirect('/home');
};