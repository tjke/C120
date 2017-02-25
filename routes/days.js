var days = require('../days.json')['days'];

exports.view = function(req, res){
  	res.json(days);
};