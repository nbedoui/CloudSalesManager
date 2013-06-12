var express = require('express');
var app = express();
var async = require("async");
// DB Access
app.model = require('../../models/SalesManagerModels');


exports.index = function(req, res){
	if (req.session.loggedIn){
		res.render(__dirname+'/sales.jade');
	} else {
		res.redirect('/login');
	}

};

exports.customers= function(req, res){
    if (req.session.loggedIn){
    	console.log("accountid="+req.session.accountId);
        //app.model.getAddresses(req.session.accountId);

        app.model.getList('CustomerModel', req.session.accountId, -1, -1, function(err, result){
            if(!err){
                res.render(__dirname+'/customers/customers.jade', {customers:result});
            } else
            {
                console.log("Erreur = "+err);
                res.render('../../views/error', {error:err});
            }
        });
	} else {
		res.redirect('/login');
	}
	
	
}

exports.customersList = function(req, res){
    if (req.session.loggedIn){
        console.log("accountid="+req.session.accountId);
        
        app.model.getCustomers2(req.session.accountId, null, null, function(err, result){
            if(!err){
                //console.log(result);
                res.send(result);
            } else
            {
                console.log("Erreur = "+err);
                res.render('../../views/error', {error:err});
            }
        });
    } else {
        res.redirect('/login');
    }
    
    
}

exports.customersSubList = function(req, res){
    if (req.session.loggedIn){
        var fieldValue = req.params.fieldValue;
        console.log("  - fieldValue="+fieldValue);
        console.log("accountid="+req.session.accountId);
       app.model.getListWithTextCriteria('CustomerModel', req.session.accountId, 'customerName', fieldValue, function(err, result){
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

exports.customer= function(req, res){
  console.log("Call of get('/:entity/:id'");
    if (req.session.loggedIn){
        var id = req.params.id;
        console.log("id : "+id);
        req.session.selectedCustomer = id; 
        app.model.getCustomer(id, function(err, result){
            if(!err){
                res.render(__dirname+'/customers/customer.jade', {model:result});
            } else
            {
                res.send(500, {error:err});
            }
        });
    } else {
        res.redirect("/login");
    }
}

exports.customerDetails= function(req, res){
    if (req.session.loggedIn){
        var accountId = req.session.accountId;
        var id = req.params.id;
        console.log("id : "+id);
        
        var getCustomer = function(callback){
            //var id = "517e933bb6771658540000032";
             app.model.getCustomer(id, function(err, customer){
                if(err){
                   callback(err, null); 
                } else
                {
                    callback(null, customer);
                }
            });

        }

        var getPhoneType = function(callback){
            app.model.getReferenceList("PhoneTypeModel", accountId, function(err, doc){
             if (err){
                callback(err, null)
             } else {
                callback(null, doc);
             }  
            });
        }

        var getAddressType = function(callback){
            app.model.getReferenceList("AddressTypeModel", accountId, function(err, doc){
             if (err){
                callback(err, null)
             } else {
                callback(null, doc);
             }  
            });
        }

        var getIndustryList = function(callback){
            app.model.getReferenceList("IndustryModel", accountId, function(err, doc){
             if (err){
                callback(err, null)
             } else {
                callback(null, doc);
             }  
            });
        }

        var getStatusList = function(callback){
            app.model.getReferenceList("StatusModel", accountId, function(err, doc){
             if (err){
                callback(err, null)
             } else {
                callback(null, doc);
             }  
            });
        }
        console.log("appel de async parallel...");
        async.parallel({customer:getCustomer, phoneType:getPhoneType, addressType:getAddressType, industryList:getIndustryList, statusList:getStatusList}, function(err, result){
            if (err){
                console.log("Erreur:"+err);
                res.send(500, {error:err});
            } else {
                //console.log("Finish : "+JSON.stringify(result));
                console.log("addressType : "+result.addressType);
                res.render(__dirname+'/customers/customerDetails.jade', {model:result});
            }
        })

    } else {
        res.redirect("/login");
    }
}

exports.customerQuotations = function(req, res){
    if (req.session.loggedIn){
        var account_id = req.session.accountId;
        console.log("accountid="+account_id);
        var customer_id = req.params.custId;
        var status = req.params.status;
        console.log("Customer Id = "+customer_id+"  Status:"+status);
        var promise = app.model.getList('AdressTypeModel')
        app.model.getRowById('CustomerModel', customer_id, function(err, customer){
            if (!err){
                var customerName = customer.customerName;
                console.log("customerName="+customerName);
                app.model.getListWithCriteria('QuotationModel', {account_id:account_id, customer_id:customer_id, status:status}, function(err, result){
                    if(!err){
                        console.log("Devis = "+result);
                        res.render(__dirname+'/quotations/quotations.jade', {model:result, customer:customerName});
                    } else
                    {
                        console.log("Erreur = "+err);
                        res.render('../../views/error', {error:err});
                    }  
            })} else
            {
                console.log("Erreur = "+err);
                res.render('../../views/error', {error:err});
            }  
        
        });
    } else {
        res.redirect('/login');
    }
}

exports.custs= function(req, res){
    app.model.getCustomers2("5173c6ed96e2cdb3d2155f1d", null, null, function(err, result){
    });
}

/*
exports.dashboard = function(req, res){
    
    app.model.customerDashBoard("518162013ff14901704ad445", function(err, result){
        console.log("Result="+JSON.stringify(result));
    })

}
*/