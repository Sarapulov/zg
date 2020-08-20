/********************

	# zg
	
	ver 1.0.5 | last updated: 2020-08-20

	OVERVIEW:

		JavaScript library for Zendesk Help Center (part of Zendesk Guide) that contains
		the collection of useful methods that may help automating routine dev tasks.

********************/

var zg = function() {
		'use strict';
	
		var mdl = {};

		mdl.version = 'ver 1.0.5 | last updated: 2020-08-20';

		mdl.help = function() {
			console.table({
							["zg().help()"]									:"return the list of available methods",
							["zg().version"]								: "return current version of the 'zg' library",
							["zg().isTicketFormSelectorPage()"]				: "TRUE if current page is a form selector page",
							["zg().isTicketFormPage()"]						: "TRUE if current page is the actual ticket form",
							["zg().getTicketFormID()"]						: "return currently selected ticket form ID as a string",
							["zg().isThisTheFormID('12345')"]				: "TRUE if passed ID is matching the current ticket form ID",
							["zg().hasAnyUserTag(['test','/office:/'])"]	: "TRUE if current user has at least one of the tags OR at least one tag is matching the pattern",
							["zg().hasAllUserTag(['test','/office:/'])"]	: "TRUE if current user has all tags OR all tags are matching the pattern",
							["zg().getUserLocale()"]						: "return current user locale from Help Center HTML",
							["zg().getAllTicketFormIDs()"]					: "return all available ticket form IDs",
							["zg().hideTicketFormIDs(['123','456'])"]		: "will hide listed ticket form IDs from the Ticket Form Selector excluding currrently selected ticket form",
							["zg().ifUrlContainsAny(['en','us'])"]			: "TRUE if either of the strings are available in the current URL. window.location.href is used to define the URL",
							["zg().ifUrlContainsAll(['en','us'])"]			: "TRUE if all of the strings are available in the current URL. window.location.href is used to define the URL",
							["zg().isVisitorLogin()"]						: "TRUE if current visitor is login to Help Center. Should be called after page is loaded."
						});

		}
	   	mdl.isTicketFormSelectorPage = function(){ // is this ticket form selector page
	   		var form = document.getElementById('new_request');
	   		return (window.location.href.indexOf('/requests') > -1) && form && form.getElementsByTagName('footer') && form.getElementsByTagName('footer').length == 0;
	   	}
	   	mdl.isTicketFormPage = function() { // is this actual ticket form page
	   		var form = document.getElementById('new_request');
	   		return !!((window.location.href.indexOf('/requests') > -1) && form && form.getElementsByTagName('footer') && (form.getElementsByTagName('footer').length > 0));
	   	}
	   	mdl.getTicketFormID = function() { // return ticket form ID
	   		var form = document.getElementById('request_issue_type_select');
	   		var form2 = document.getElementById('request_ticket_form_id');
	   		return (form && form.value) || (form2 && form2.value);
	   	}
	   	mdl.isThisTheFormID = function(form_id) { // return TRUE if current ticket form ID matches the argument
	   		return mdl.getTicketFormID() == form_id;
	   	}
	   	mdl.hasAnyUserTag = function(listOfUserTags) { // return TRUE if Help Center user has at least one tag or matching the regex pattern
	   		var hasTags,
	   			h = HelpCenter,
	   			hasHelpCenter = h && h.user && h.user.tags && h.user.tags.length;
	   		
	   		if (listOfUserTags && hasHelpCenter) {
	   			hasTags = listOfUserTags.filter(function(n) {
				    var isMatchPattern;
	   				if (n.indexOf('/') > -1) {
	   					var re = new RegExp(n.replace(/\//g, ''));
	   					for (var i = 0; i < h.user.tags.length; i++) {
	   						if (re.test(h.user.tags[i])) {
	   							isMatchPattern = true;
	   							break;
	   						}
	   					}
	   				}
				    return (h.user.tags.indexOf(n) !== -1) || !!isMatchPattern;
				});
	   		}
	   		return !!hasTags && !!hasTags.length;
	   	}
	   	mdl.hasAllUserTag = function(listOfUserTags) { // return TRUE if all tags in the array are present
	   		var hasAllTags,
	   			h = HelpCenter,
	   			hasHelpCenter = h && h.user && h.user.tags && h.user.tags.length;
	   		
	   		if (listOfUserTags && hasHelpCenter) {
	   			hasAllTags = listOfUserTags.filter(function(n) {
				    var isMatchPattern;

	   				if (n.indexOf('/') > -1) {
	   					var re = new RegExp(n.replace(/\//g, ''));
	   					for (var i = 0; i < h.user.tags.length; i++) {
	   						if (re.test(h.user.tags[i])) isMatchPattern = true;
	   					}
	   				}
				    return listOfUserTags && listOfUserTags.length && (h.user.tags.indexOf(n) !== -1) || !!isMatchPattern;
				});
	   		}
	   		return !!hasAllTags && !!hasAllTags.length && (hasAllTags.length == listOfUserTags.length);
	   	}
	   	mdl.getUserLocale = function() { // return user locale from the URL
	   		var html = document.getElementsByTagName('html')[0];
			return html && html.attributes && html.attributes.lang && html.attributes.lang.value.toLowerCase();
		}
		mdl.getAllTicketFormIDs = function() { // return an array of all available ticket form IDs as strings
			var allFormIds = [];
			var formSelector = document.getElementById('request_issue_type_select');
			if (formSelector) {
				formSelector && formSelector.childNodes.forEach(function(node){
					if (node && node.nodeName && (node.nodeName == 'OPTION') && (node.value !== '-')) allFormIds.push(node.value);
				});
			} else {
				var form = document.getElementById('request_ticket_form_id');
				if (form && form.value) allFormIds.push(form.value);
			}
	   		return allFormIds;
	   	}
	   	mdl.hideTicketFormIDs = function(form_ids){
			if (form_ids) {
				function hideFormIds(form_ids) { // initiaite the filtering logic
					// remove the currently ticket  from the list of form IDs
					form_ids = form_ids.filter(function(e) { return e !== mdl.getTicketFormID() })
					attachFormSelectorListeners(form_ids);
				}
				function attachFormSelectorListeners(form_ids) { // attach event listener to a child List under nesty-panel (this is how Help Center ticket form field dropdown is rendered)
					var targetNodes = document.getElementsByClassName('nesty-panel');
					for (var i=0; i < targetNodes.length; i++) {
						var observer = new MutationObserver(function(mutationsList, observer) {
							handleTicketFormClick(mutationsList, form_ids);
						});
						observer.observe(targetNodes[i], { attributes: false, childList: true, subtree: false });
					}
				}
				function handleTicketFormClick(mutationsList, form_ids) { // when dropdown list shows up this will remove unwanted form IDs and keep the one in @form_ids
					var ulLabel = mutationsList[0].target.querySelectorAll('ul[aria-labelledby]');
					if (!(ulLabel && ulLabel.length)) {
						mutationsList[0].target.querySelectorAll('li').forEach(function(element) {
							if ( (element.id !== '-') && (form_ids.indexOf(element.id) > -1) ) element.remove();
						})
					}
				}
				hideFormIds(form_ids);
			} else {
				console.warn('ERROR: zg.js > hideTicketFormIDs no ticket form IDs were passed to hideTicketFormIDs function');
			}
		}
		mdl.ifUrlContainsAny = function(arrayOfString) { // check if any of passed atttributes are presented in the URL
			var isUrlContainsAny;
			if (arrayOfString !== undefined) {
				var url = window.location.href;
				if (arrayOfString instanceof Array) {
					for (var i = 0; i < arrayOfString.length; i++) {
						if (url.indexOf(arrayOfString[i]) > -1) {
							isUrlContainsAny = true;
							break;
						}
					}
				} else if (typeof arrayOfString === 'string' || arrayOfString instanceof String) {
					isUrlContainsAny = url.indexOf(arrayOfString) > -1;
				} else {
					console.warn('ERROR: zg.js > ifUrlContainsAny method received unexpected value. While Array of strings or a String is expected.')
				}
			}
			return !!isUrlContainsAny;
		}
		mdl.ifUrlContainsAll = function(arrayOfString) { // check if all of passed atttributes are presented in the URL
			var isUrlContainsAll;
			if (arrayOfString !== undefined) {
				var url = window.location.href;
				if (arrayOfString instanceof Array) {
					var tempArray = [];
					for (var i = 0; i < arrayOfString.length; i++) {
						if (url.indexOf(arrayOfString[i]) > -1) {
							tempArray.push(arrayOfString[i]);
						}
					}
					isUrlContainsAll = arrayOfString.length == tempArray.length;
				} else if (typeof arrayOfString === 'string' || arrayOfString instanceof String) {
					isUrlContainsAll = url.indexOf(arrayOfString) > -1;
				} else {
					console.warn('ERROR: zg.js > ifUrlContainsAll method received unexpected value. While Array of strings or a String is expected.')
				}
			}
			return !!isUrlContainsAll;
		}
		mdl.isVisitorLogin = function() { // check if current visitor is login
			try {
				return HelpCenter && HelpCenter.user && HelpCenter.user.role != 'anonymous';
			} catch(err) {
				console.warn('ERROR: zg.js > isVisitorLogin method failed execution. Consider calling this method after Help Center papge is loaded.', err);
				return false;
			}
		}

	   	return mdl;
}