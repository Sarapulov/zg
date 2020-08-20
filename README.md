# zg
	
ver 1.0.5 | last updated: 2020-08-20

Nano JavaScript library for Zendesk Help Center (part of Zendesk Guide) that contains a collection of useful methods that may help automating routine dev tasks.

```

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

```