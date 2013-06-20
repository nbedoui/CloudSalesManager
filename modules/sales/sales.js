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

//Show the customers page
exports.customers= function(req, res){
    if (req.session.loggedIn){
    	console.log("accountid="+req.session.accountId);
        res.render(__dirname+'/customers/customers.jade');
	} else {
		res.redirect('/login');
	}
	
	
}

//API list of customers (with criteria)
exports.customersList = function(req, res){
    if (req.session.loggedIn){
        var fieldName = null;
        var fieldValue = null;
        if ((req.body.fieldName) && (req.body.fieldValue)) { 
            fieldName = req.body.fieldName;
            fieldValue = req.body.fieldValue;
        }
        console.log(fieldName+":"+fieldValue);

        console.log("accountid="+req.session.accountId);
       app.model.getCustomers2(req.session.accountId, fieldName, fieldValue, function(err, result){
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

exports.customerDetails= function(req, res){
    if (req.session.loggedIn){
        var accountId = req.session.accountId;
        var id = req.params.id;
        var active = req.params.active;
        console.log("id : "+id);
        var getCustomer = function(callback){
            //var id = "517e933bb6771658540000032";
             app.model.getCustomer(id, function(err, customer){
                if(err){
                    console.log("Customer="+customer);
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

        var getManagerList = function(callback){
            console.log(".......... getManagerList...");
            app.model.getReferenceList("User", accountId, function(err, doc){
             if (err){
                callback(err, null)
             } else {
                callback(null, doc);
             }  
            });
        }

        var criteria = {customer:getCustomer, phoneType:getPhoneType, addressType:getAddressType, industryList:getIndustryList, statusList:getStatusList, managerList:getManagerList};
        async.parallel(criteria, function(err, result){
            if (err){
                //console.log("Erreur:"+err);
                res.send(500, {error:err});
            } else {
                console.log("Finish : "+JSON.stringify(result));
                //console.log("addressType : "+result.addressType);
                res.render(__dirname+'/customers/customerDetails.jade', {model:result, active:active});
            }
        })
    } else {
        res.redirect("/login");
    }
}

//Customers CRUD
//Show new customer dialog wirth all the refs.
exports.newCustomer = function(req, res){
    if (req.session.loggedIn){
        var accountId = req.session.accountId;
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
        var criteria = {industryList:getIndustryList, statusList:getStatusList};
        async.parallel(criteria, function(err, result){
            if (err){
                console.log("Erreur:"+err);
                res.send(500, {error:err});
            } else {
                console.log("Finish : "+JSON.stringify(result));
                console.log("addressType : "+result.addressType);
                res.render(__dirname+'/customers/newCustomer.jade', {model:result});
            }
        })
    } else {
        res.redirect("/login");
    }

}

//Insert a new customer into the Database
exports.insertCustomer = function(req, res){
    var data = req.body;
    console.log("data="+JSON.stringify(data));
    data.account_id=req.session.accountId;
    data.customer_owner=req.session.userId;
    app.model.insertDocument("CustomerModel", data, function(err, doc){
        if(err){
            console.log("Erreur :"+err);
            res.send(500, {error:err});
        } else {
            res.redirect("/sales/customerDetails/"+doc._id+"/infos");
        }
    });
}

//Modifiy the customer data into the Database
exports.updateCustomer = function(req, res){

    var _id = req.params.id;
    var data = req.body;
    console.log("**********************************")
    console.log("Update Customer _id:"+_id+" - data="+JSON.stringify(data));
    data.account_id=req.session.accountId;
    
    data.customer_owner=req.session.userId;
    
    app.model.updateDocument("CustomerModel", _id, data, function(err, doc){
        if(err){
            console.log("Erreur :"+err);
            res.send(500, {error:err});
            console.log("**********************************")
        } else {
            res.redirect("/sales/customerDetails/"+doc._id+"/infos");
            console.log("**********************************")
        }
    });
}

//Delete a customer from the database
exports.deleteCustomer = function(req, res){

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


exports.maps = function(req, res){
    if (req.session.loggedIn){
        var custId = req.params.custId;
        var addressId = req.params.addressId;
        app.model.getSubDocument('Customer', 'addresses', addressId, function(err, address){
            if(err){
                console.log("erreur"+err);
            } else {
                var addressStr = address.street+ " "+address.zipCode+" "+address.city+" "+address.country;

                console.log("Address="+addressStr+" - custId"+custId);
                res.render(__dirname+'/customers/maps.jade', {address:addressStr, customerId:custId});
            }
        })
        
     } else {
        res.redirect('/login');
    }
}