(function($){
	
	Backbone.Model.prototype.idAttribute = '_id';

	var quotationsView;

	//Models 
	var quotation = Backbone.Model.extend({
		urlRoot:'/list/quotations',
		logo:'/images/quotation.png'
	});

	var quotationsList = Backbone.Collection.extend({
		model : quotation,
		url: '/list/quotations'
	});

	var quotations = new quotationsList();

	//Views
	var quotationView = Backbone.View.extend({
		tagName : 'div',
		events : {
			'click .flip':'flip',
			'click .roll':'flip',
            'click .card':'selectCard',
            'click .quotationDetails':'quotationDetails'
		},
		quotationDetails : function(e){
			e.preventDefault();
			var id = e.currentTarget.id;
			var idquotation = id.split('-')[1];
			console.log(" idquotation:"+idquotation);
			window.location.href="/sales/quotationDetails/"+idquotation+"/infos";
		},
		selectCard : function(e){
			e.preventDefault();
			var _parent = $(e.currentTarget).parent();
			var idquotation = _parent.attr('id');
			$(".tile.wcard").removeClass('selected');
			console.log(" idquotation:"+idquotation);
			$("#"+idquotation).toggleClass("selected");
		},
		flip : function(e){
			e.preventDefault();
			var id = e.currentTarget.id;
			var idquotation = id.split('-')[1];
			console.log("id="+id+" idquotation:"+idquotation);
			$("#card-"+idquotation).toggleClass("flipped");
		},
		initialize : function(){
			this.template = _.template($('#quotation-template').html());
		},
		render : function(){
			var colors = ["#F3B200", "#77B900", "#2572EB", "#AD103C", "#632F00", "#B01E00", "#C1004F", "#7200AC", "#4617B4",
						  "#006AC1", "#008287", "#199900", "#00C13F", "#FF981D", "#FF2E12", "#FF1D77", "#AA40FF", "#1FAEFF",
						  "#4294DE", "#008E8E", "#7BAD18", "#C69408", "#DE4AAD", "#00A3A3"] 
			var data = this.model.toJSON();
			this.$el.append(this.template({model: data.quotation}));
			this.$el.attr('id', data.quotation._id);
            this.$el.addClass("tile wcard high");
            var index = Math.floor(Math.random()*24);
            color = colors[index]; 
            this.$el.css("background", color);
			return this;
		}
	})

	var quotationsView = Backbone.View.extend({
		model: quotations,
		el : $('#quotations-container'),
		perPage : 20,
		events : {
			'click #search':'searchquotation',
			'keypress #searchquotationName':'searchquotationEdit',
			'click #homeBtn':'command',
            'click #addBtn':'command',
            'click #deleteBtn':'command',
            'click #prevBtn':'command',
            'click #nextBtn':'command'

		},
		initialize : function(){
			var self =this;
			this.options.page=1;
			this.fetch();
		},
		fetch : function(){
			var self = this;
			this.model.fetch({
				success: function(){ 
					console.log("cust="+JSON.stringify(quotations));
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
			
			var quotations = this.model.models;
			
			var startPos = (this.options.page-1)*this.perPage;
			var endPos = Math.min(startPos + this.perPage, this.count);
			console.log("startPos="+startPos+" endPos="+endPos);
			var self = this;
			$("#quotations-list").html('');
			for (var i = startPos; i < endPos; i++){
				var quotationView = (new quotationView({model: quotations[i]})).render().el;
			    $("#quotations-list").append(quotationView);
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
            var idquotation = $(".mediumListIconTextItem.selected").attr('id');
                    
            switch(idBtn) {
                case "homeBtn" : {
                	console.log("home page");
                    window.location.href = '/';
                }
                break;
                case "addBtn" : {
                	console.log("Ajouter un client");
                	window.location.href = '/sales/newquotation';
                }
                break;
                case "deleteBtn" : {
                    console.log("Delete quotation id="+idquotation);
                    //window.location.hash = 'quotation/'+idquotation;
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
        searchquotation : function(e){
        	console.log("Search?...");
        	var self = this;
        	var quotationNameText = $("#searchquotationName").val();
            if (quotationNameText){
                console.log("quotationNameText="+quotationNameText);
                this.model.url="/list/quotation/quotationName="+quotationNameText;
                this.fetch();
            }
        },
        searchquotationEdit : function(e){
        	if (e.keyCode == 13) this.searchquotation();
        }
	});
	$(document).ready(function(){
		quotationsView = new quotationsView();
		Backbone.history.start({pushState: true});
	})
})(jQuery);