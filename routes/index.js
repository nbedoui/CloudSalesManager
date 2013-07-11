var home = require('../modules/home/home');
var login = require('../modules/login/login');
var common = require('../modules/common/models/common');
var sales = require('../modules/sales/sales');
var address = require('../modules/sales/customers/addresses');
var quotation = require('../modules/sales/quotations/quotations')
var invoice = require('../modules/sales/invoices/invoices')
var products = require('../modules/sales/products/products')

//app.use(home);
//app.use(login);
//app.use(sales);

module.exports = function(app){
	app.get('/', home.index);


	app.get('/login', login.index);
	app.post('/auth', login.auth);


	//Sales module
	app.get('/sales', sales.index);

	
//customers
	app.get('/sales/customers', sales.customers); //Show customers view

	app.get('/sales/customerDetails/:id/:active', sales.customerDetails); 
	app.get('/sales/newCustomer', sales.newCustomer);
	app.post('/sales/insertCustomer', sales.insertCustomer);
	app.post('/sales/updateCustomer/:id', sales.updateCustomer);

	//Api
	app.post('/list/customers', sales.customersList)
	//***********************************	


	//address
	app.post('/sales/insertAddress/:custId', address.insertAddress);
	app.post('/sales/updateAddress/:custId/:id', address.updateAddress);
	app.get('/sales/deleteAddress/:custId/:id', address.deleteAddress);
	
	//maps for unique address
	app.get('/sales/customer/address/maps/:custId/:addressId', sales.maps);


	
	//Quotations menu
	app.get('/sales/quotations', quotation.index);
	//Quotations menu
	app.get('/sales/quotation', quotation.newQuotation);
	//Quotations
	app.get('/sales/quotations/:custId/:status', sales.customerQuotations);
	
	//Invoices
	app.get('/sales/invoices', invoice.index);

	//Items
	app.get('/sales/products', products.index);
	app.get('/sales/product/:id', products.productDetails);
	app.post('/sales/updateProduct/:id', products.updateProduct);
	app.post('/list/products', products.productsList);

	//Quotations
	app.get('/list/quotations', quotation.quotationsList)

	
	//Common pages
	app.get('/params', common.params);
	app.get('/params/:param', common.param);
	app.post('/list/:entity', common.paramList);

	//CRUD GST (TVA)
	app.post('/params/update/:entity/:id', common.updateDocument);
	app.post('/params/insert/:entity', common.insertDocument);
	app.delete('/params/delete/:entity', common.deleteDocument);
	app.delete('/list/:entity/:id', common.deleteDocument);

	
}