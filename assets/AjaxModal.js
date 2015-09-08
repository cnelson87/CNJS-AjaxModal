/*
	TITLE: AjaxModal

	DESCRIPTION: Subclass of ModalWindow retrieves &amp; injects Ajax content

	VERSION: 0.2.0

	USAGE: var myAjaxModal = new AjaxModal('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: CN

	DEPENDENCIES:
		- jQuery 2.1.4+
		- Class.js
		- LoaderSpinner.js
		- ModalWindow.js

*/

var AjaxModal = ModalWindow.extend({
	init: function($triggers, objOptions) {

		this.options = $.extend({
			ajaxErrorMsg: '<div class="errormessage"><p>Sorry. Ajax request failed.</p></div>',
			customEventPrfx: 'CNJS:AjaxModal'
		}, objOptions || {});

		// setup & properties
		this.ajaxLoader = null;

		this._super($triggers, this.options);

	},


/**
*	Private Methods
**/

	initDOM: function() {
		this._super();
		this.ajaxLoader = new LoaderSpinner(this.$elContent);
	},


/**
*	Public Methods
**/

	getContent: function() {
		var self = this;
		var ajaxUrl = this.$elActiveTrigger.data('ajaxurl') || this.$elActiveTrigger.attr('href');
		var targetID = ajaxUrl.split('#')[1] || false;
		var targetEl;

		this.ajaxLoader.addLoader();

		$.when(this.getAjaxContent(ajaxUrl, 'html')).done(function(response) {
			//console.log(response);

			if (targetID) {
				targetEl = $(response).find('#' + targetID);
				if (targetEl.length) {
					self.contentHTML = $(response).find('#' + targetID).html();
				} else {
					self.contentHTML = $(response).html();
				}
				
			} else {
				self.contentHTML = response;
			}

			self.ajaxLoader.removeLoader();
			self.setContent();

		}).fail(function(response) {
			//console.log(response);
			self.contentHTML = '';
			self.ajaxLoader.removeLoader();
			self.$elContent.html(self.options.ajaxErrorMsg);
		});

	},

	// returns an Ajax GET request using deferred, url is required, dataType is optional
	getAjaxContent: function(url, dataType) {
		return $.ajax({
			type: 'GET',
			url: url,
			dataType: dataType || 'json'
		});
	}

});

//uncomment to use as a browserify module
//module.exports = AjaxModal;
