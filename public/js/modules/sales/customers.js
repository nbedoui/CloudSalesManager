(function($){
	
	Backbone.Model.prototype.idAttribute = '_id';

	var customersView;

	//Models 
	var Customer = Backbone.Model.extend({
		urlRoot:'/list/customers',
		defaults : {
			logo:'/images/customer.png'
		}
	});

	var CustomersList = Backbone.Collection.extend({
		model : Customer,
		url: '/list/customers'
	});

	var customers = new CustomersList();

	//Views
	var CustomerView = Backbone.View.extend({
		tagName : 'div',
		events : {
			'click .flip':'flip',
			'click .roll':'flip'
		},
		flip : function(e){
			e.preventDefault();
			var id = e.currentTarget.id;
			var idCustomer = id.split('-')[1];
			console.log("id="+id+" idCustomer:"+idCustomer);
			$("#"+idCustomer).toggleClass("flipped");
		},
		initialize : function(){
			this.template = _.template($('#customer-template').html());
		},
		render : function(){
			//console.log("render customer view");
			var data = this.model.toJSON();
			//console.log("data="+JSON.stringify(data));
			this.$el.html(this.template({model: data.customer}));
			//this.$el.attr('id', data._id);
            //this.$el.addClass("flip-container");
            this.$el.addClass("tile wcard high");
            color = Mondrian.init("hex");
            //console.log("color="+color);
            //this.$el.css("background", '#'+Math.floor(Math.random()*16777215).toString(16));
            this.$el.css("background", color);
			return this;
		}
	})

	var CustomersView = Backbone.View.extend({
		model: customers,
		el : $('#content'),
		perPage : 15,
		events : {
			'click #search':'searchCustomer',
			'click #homeBtn':'command',
            'click #addBtn':'command',
            'click #deleteBtn':'command',
            'click #infosBtn':'command',
            'click #prevBtn':'command',
            'click #nextBtn':'command'

		},
		test : function(e){
			console.log('Hello');
		},
		flip: function(e){
			console.log("Hello");
			e.preventDefault();
			var id = e.currentTarget.id;
			var idCustomer = id.split('-')[1];
			console.log("id="+id+" idCustomer:"+idCustomer);
			$("#"+idCustomer).toggleClass("flipped");
		},
		initialize : function(){
			var self =this;
			this.options.page=1;

			this.model.on('add', this.render, this);
			this.model.on('remove', this.render, this);
			
			this.fetch();

			
		},
		fetch : function(){
			var self = this;
			this.model.fetch({
				success: function(){ 
					self.count = self.model.models.length;
					self.maxPages = Math.ceil(parseInt(self.count, 10) / parseInt(self.perPage, 10));
					self.render();

				},
				error: function(){
					console.log('Cannot retrive models from server');
				}
			})

		},
		render: function(){
			
			var customers = this.model.models;
			//console.log("Customers="+customers);
			var startPos = (this.options.page-1)*this.perPage;
			var endPos = Math.min(startPos + this.perPage, this.count);
			//console.log("Render ....startPos="+startPos+"  endPos="+endPos);
			var self = this;
			$("#customers-container").html('');
			for (var i = startPos; i < endPos; i++){
				//console.log("i="+i);
				var customerView = (new CustomerView({model: customers[i]})).render().el;
			    $("#customers-container").append(customerView);
			};

			if (this.options.page == this.maxPages){
                	this.disableBtn("#nextBtn");
                }
			return this;
		},
		enableBtn : function(id){
			if ($(id).hasClass("disabled")){
                $(id).removeClass("disabled");
            }
		},
		disableBtn : function(id){
			if (! $(id).hasClass("disabled")){
                $(id).addClass("disabled");
            }
		},
        command : function(e){
        	var idBtn = arguments[0].currentTarget.id;
            var idCustomer = $(".mediumListIconTextItem.selected").attr('id');
                    
            switch(idBtn) {
                case "homeBtn" : {
                    window.location.hash = 'index';
                }
                break;
                case "addBtn" : console.log("Ajouter un client");
                break;
                case "deleteBtn" : {
                    console.log("Delete customer id="+idCustomer);
                    //window.location.hash = 'customer/'+idCustomer;
                }
                break;
                case "infosBtn" : {
                    window.location.href = '/sales/customer/'+idCustomer;
                }
                break;
                case "prevBtn" : {
                	if (this.options.page > 1){
                		this.options.page -=1;	
                		this.render();
                		this.enableBtn("#nextBtn");
                		if (this.options.page == 1){
                			this.disableBtn("#prevBtn");
                		}
                	} 
                     
                    //window.location.href = '/sales/customer/'+idCustomer;
                }
                break;
                case "nextBtn" : {
                	if (this.options.page < this.maxPages){
                		this.options.page +=1;
                		this.enableBtn("#prevBtn");	
                		this.render();
                		if (this.options.page == this.maxPages){
                			this.disableBtn("#nextBtn");
                		}
                	} 
                    
                }
                break;
            }
        },
        searchCustomer : function(){
        	var self = this;
        	var customerNameText = $("#searchCustomerName").val();
            if (customerNameText){
                console.log("customerNameText="+customerNameText);
                this.model.url="/list/Customer/customerName="+customerNameText;
                this.fetch();
            }
        }
	});

	

	$(document).ready(function(){
		customersView = new CustomersView();
		Backbone.history.start({pushState: true});
	})
})(jQuery);