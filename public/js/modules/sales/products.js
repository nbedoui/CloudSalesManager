(function($){
	
	Backbone.Model.prototype.idAttribute = '_id';

	var productsView;

	//Models 
	var Product = Backbone.Model.extend({
		urlRoot:'/list/products'
	});

	var ProductsList = Backbone.Collection.extend({
		model : Product,
		url : '/list/products'
	});

	var products = new ProductsList();

	//Views
	var ProductView = Backbone.View.extend({
		tagName : 'li',
		events : {
			'click .card':'selectCard',
            'click .productDetails':'productDetails'
		},
		productDetails : function(e){
			e.preventDefault();
			var id = e.currentTarget.id;
			console.log("id="+id);
			var idproduct = id.split('-')[1];
			console.log(" idproduct:"+idproduct);
			window.location.href="/sales/product/"+id;
		},
		selectCard : function(e){
			e.preventDefault();
			var _parent = $(e.currentTarget).parent();
			var idproduct = _parent.attr('id');
			$(".tile.wcard").removeClass('selected');
			console.log(" idproduct:"+idproduct);
			$("#"+idproduct).toggleClass("selected");
		},
		flip : function(e){
			e.preventDefault();
			var id = e.currentTarget.id;
			var idproduct = id.split('-')[1];
			console.log("id="+id+" idproduct:"+idproduct);
			$("#card-"+idproduct).toggleClass("flipped");
		},
		initialize : function(){
			this.template = _.template($('#product-template').html());
		},
		render : function(){
			var data = this.model.toJSON();
			this.$el.append(this.template({model: data}));
			this.$el.attr('id', data._id);
            //this.$el.addClass("list-large clearfix");
            var index = Math.floor(Math.random()*24);
            return this;
		}
	})

	var ProductsView = Backbone.View.extend({
		model: products,
		el : $('#products-container'),
		perPage : 10,
		events : {
			'click #search':'searchproduct',
			'keypress #searchFieldValue':'searchproductEdit',
			'click #homeBtn':'command',
			'click #searchBtn':'command',
            'click #addBtn':'command',
            'click #deleteBtn':'command',
            'click #prevBtn':'command',
            'click #nextBtn':'command'

		},
		initialize : function(){
			var self =this;
			this.options.page=1;
			this.fetch('');
		},
		fetch : function(params){
			var self = this;

			this.model.fetch(
				{
					data:$.param(params),
					type: 'POST',
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
			
			var products = this.model.models;
			
			var startPos = (this.options.page-1)*this.perPage;
			var endPos = Math.min(startPos + this.perPage, this.count);
			console.log("startPos="+startPos+" endPos="+endPos);
			var self = this;
			$("#products-list").html('');
			for (var i = startPos; i < endPos; i++){
				var productView = (new ProductView({model: products[i]})).render().el;
			    $("#products-list").append(productView);
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
            var idproduct = $(".mediumListIconTextItem.selected").attr('id');
                    
            switch(idBtn) {
                case "searchBtn" : {
                	console.log("Search...");
                	$("#searchPanel").toggle();
                }
                break;
                case "addBtn" : {
                	console.log("Ajouter un client");
                	window.location.href = '/sales/newproduct';
                }
                break;
                case "deleteBtn" : {
                    console.log("Delete product id="+idproduct);
                    //window.location.hash = 'product/'+idproduct;
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
        searchproduct : function(e){
        	console.log("Search?...");
        	var self = this;
        	var fieldName = $("#searchFieldName").val();
        	var fieldValue = $("#searchFieldValue").val();
        	var searchParams = '';
            if (fieldValue){
                console.log("fieldName="+fieldName+" = fieldValue="+fieldValue);
                searchParams = {'fieldName':fieldName, 'fieldValue':fieldValue}
                //this.fetch("/list/products/"+fieldName+"/"+fieldValue);
                this.fetch(searchParams);
            } 
        },
        searchproductEdit : function(e){
        	if (e.keyCode == 13) {
        		e.preventDefault();
        		this.searchproduct();
        	}
        }
	});
	$(document).ready(function(){
		productsView = new ProductsView();
		Backbone.history.start({pushState: true});
	})
})(jQuery);