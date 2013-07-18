var express = require('express');
var app = express();
var async = require("async");
// DB Access
app.model = require('../../../models/SalesManagerModels');


exports.index = function(req, res){
	if (req.session.loggedIn){
		res.render(__dirname+'/products.jade');
	} else {
		res.redirect('/login');
	}

}

exports.productDetails = function(req, res){
    if (req.session.loggedIn){
        var _id = req.params.id;
        app.model.getDocument('Product', _id, function(err, doc){
            if (err){
                res.send(500);
            }  else {
                res.render(__dirname+'/product.jade', {model:doc});
            }
        })
        
    } else {
        res.redirect('/login');
    }

}
exports.newProduct = function(req, res){
    if (req.session.loggedIn){
        res.render(__dirname+'/newProduct.jade');
    } else {
        res.redirect('/login');
    }

}

//Insert the customer data into the Database
exports.insertProduct = function(req, res){
    if (req.session.loggedIn){
        var _id = req.params.id;
        var data = req.body;
        console.log("**********************************")
        console.log("Insert product  - data="+JSON.stringify(data));
        data.account_id=req.session.accountId;
        
        //data.customer_owner=req.session.userId;
        
        app.model.insertDocument("Product", data, function(err, doc){
            if(err){
                console.log("Erreur :"+err);
                res.send(500, {error:err});
                console.log("**********************************")
            } else {
                res.redirect("/sales/products");
                console.log("**********************************")
            }
        });
    } else {
        res.redirect('/login');
    }
}

//Modifiy the customer data into the Database
exports.updateProduct = function(req, res){
    if (req.session.loggedIn){
        var _id = req.params.id;
        var data = req.body;
        console.log("**********************************")
        console.log("Update product _id:"+_id+" - data="+JSON.stringify(data));
        data.account_id=req.session.accountId;
        
        //data.customer_owner=req.session.userId;
        
        app.model.updateDocument("Product", _id, data, function(err, doc){
            if(err){
                console.log("Erreur :"+err);
                res.send(500, {error:err});
                console.log("**********************************")
            } else {
                res.redirect("/sales/product/"+doc._id);
                console.log("**********************************")
            }
        });
    } else {
        res.redirect('/login');
    }
}

exports.productsList = function(req, res){
    if (req.session.loggedIn){
        var fieldName = null;
        var fieldValue = null;
        if ((req.body.fieldName) && (req.body.fieldValue)) { 
            fieldName = req.body.fieldName;
            fieldValue = req.body.fieldValue;

            console.log(fieldName+":"+fieldValue);
        }
        

        console.log("accountid="+req.session.accountId);
       app.model.getProducts(req.session.accountId, fieldName, fieldValue, function(err, result){
            if (!err){
                res.send(result);
            } else {
                res.send(500, {error:err});
            }
            
        });

    } else {
        res.redirect("/login");
    }
}

exports.productsCodeList = function(req, res){
    if (req.session.loggedIn){
        var fieldValue = null;
        if (req.body.q) { 
            fieldValue = req.body.q;

            console.log("ProductCode :"+fieldValue);
        }
        

        console.log("accountid="+req.session.accountId);
       app.model.getProductCodeList(req.session.accountId, fieldValue, function(err, result){
            if (!err){
                res.send(result);
            } else {
                res.send(500, {error:err});
            }
            
        });

    } else {
        res.redirect("/login");
    }
}

exports.apiProductDetails = function(req, res){
    if (req.session.loggedIn){
        var _id = req.params.id;
        app.model.getDocument('Product', _id, function(err, doc){
            if (err){
                res.send(500);
            }  else {
                res.send(doc);
            }
        })
        
    } else {
        res.redirect('/login');
    }

}
    