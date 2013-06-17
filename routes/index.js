var home = require('../modules/home/home');
var login = require('../modules/login/login');
var common = require('../modules/common/common');
var sales = require('../modules/sales/sales');

//app.use(home);
//app.use(login);
//app.use(sales);

module.exports = function(app){
	app.get('/', home.index);


	app.get('/login', login.index);
	app.post('/auth', login.auth);


	app.get('/sales', sales.index);


	app.get('/sales/customers', sales.customers);
	app.get('/sales/newCustomer', sales.newCustomer);
	app.post('/sales/insertCustomer', sales.insertCustomer);
	app.post('/sales/updateCustomer/:id', sales.updateCustomer);

	app.post('/sales/insertAddress/:custId', sales.insertAddress);
	app.post('/sales/updateAddress/:custId/:id', sales.updateAddress);
	app.get('/sales/deleteAddress/:custId/:id', sales.deleteAddress);
	
	app.get('/sales/customer/address/maps/:lat/:lng', sales.maps);


	app.get('/sales/customer/:id', sales.customer);
	app.get('/sales/customerDetails/:id/:active', sales.customerDetails);

	//Quotations
	app.get('/sales/quotations/:custId/:status', sales.customerQuotations);
	//api
	app.get('/list/customers', sales.customersList)
	app.get('/list/customer/customerName=:fieldValue', sales.customersSubList)

	//Common pages
	app.get('/params', common.params);
	app.get('/params/gst', common.gst);

	//CRUD GST (TVA)
	app.post('/params/update/:entity/:id', common.updateDocument);
	app.post('/params/insert/:entity', common.insertDocument);
	app.delete('/params/delete/:entity', common.deleteDocument);

	
}