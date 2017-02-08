var projects = require('../projects.json');

exports.view = function(req, res){
  	res.render('organizations', projects);
};