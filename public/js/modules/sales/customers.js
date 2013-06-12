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
			'click .roll':'flip',
            'click .card':'selectCard',
            'click .customerDetails':'customerDetails'
		},
		customerDetails : function(e){
			e.preventDefault();
			var id = e.currentTarget.id;
			var idCustomer = id.split('-')[1];
			console.log(" idCustomer:"+idCustomer);
			window.location.href="/sales/customerDetails/customer="+idCustomer;
		},
		selectCard : function(e){
			e.preventDefault();
			var _parent = $(e.currentTarget).parent();
			var idCustomer = _parent.attr('id');
			//var idCustomer = id.split('-')[1];
			$(".tile.wcard").removeClass('selected');
			console.log(" idCustomer:"+idCustomer);
			$("#"+idCustomer).toggleClass("selected");
		},
		flip : function(e){
			e.preventDefault();
			var id = e.currentTarget.id;
			var idCustomer = id.split('-')[1];
			console.log("id="+id+" idCustomer:"+idCustomer);
			$("#card-"+idCustomer).toggleClass("flipped");
		},
		initialize : function(){
			this.template = _.template($('#customer-template').html());
		},
		render : function(){
			//var colors = ["#76a7fa", "#e46f61","#4dbfd9", "#fbcb43", "#bc5679", "#8cc474", "#f9b256", "#6f85bf", "#8cc474"] 
			//var colors = ["#008299", "#2672EC","#8C0095", "#5133AB", "#AC193D", "#D24726", "#008A00", "#094AB2", "#8cc474"] 
			var colors = ["#F3B200", "#77B900", "#2572EB", "#AD103C", "#632F00", "#B01E00", "#C1004F", "#7200AC", "#4617B4",
						  "#006AC1", "#008287", "#199900", "#00C13F", "#FF981D", "#FF2E12", "#FF1D77", "#AA40FF", "#1FAEFF",
						  "#4294DE", "#008E8E", "#7BAD18", "#C69408", "#DE4AAD", "#00A3A3"] 
			//console.log("render customer view");
			var data = this.model.toJSON();
			//console.log("data="+JSON.stringify(data));
			//this.$el.html(this.template({model: data.customer}));
			this.$el.append(this.template({model: data.customer}));
			this.$el.attr('id', data.customer._id);
            //this.$el.addClass("flip-container");
            this.$el.addClass("tile wcard high");
            //color = Mondrian.init("hex");
            var index = Math.floor(Math.random()*24);
            //console.log("index="+index);
            color = colors[index]; 
            //this.$el.css("background", '#'+Math.floor(Math.random()*16777215).toString(16));
            this.$el.css("background", color);
			return this;
		}
	})

	var CustomersView = Backbone.View.extend({
		model: customers,
		el : $('#customers-container'),
		perPage : 16,
		events : {
			'click #search':'searchCustomer',
			'click #homeBtn':'command',
            'click #addBtn':'command',
            'click #deleteBtn':'command',
            'click #prevBtn':'command',
            'click #nextBtn':'command'

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
			$("#customers-list").html('');
			for (var i = startPos; i < endPos; i++){
				//console.log("i="+i);
				var customerView = (new CustomerView({model: customers[i]})).render().el;
			    $("#customers-list").append(customerView);
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
                	console.log("home page");
                    window.location.href = '/';
                }
                break;
                case "addBtn" : console.log("Ajouter un client");
                break;
                case "deleteBtn" : {
                    console.log("Delete customer id="+idCustomer);
                    //window.location.hash = 'customer/'+idCustomer;
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