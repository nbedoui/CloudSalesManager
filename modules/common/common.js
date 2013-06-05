var express = require('express');
var app = express();
// DB Access
app.model = require('../../models/SalesManagerModels');


exports.params = function(req, res){
	if (req.session.loggedIn){
		res.render(__dirname+'/params.jade');
	} else {
		res.redirect('/login');
	}

};