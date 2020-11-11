# zg
	
## ver 1.0.8 | last updated: 2020-11-11

Nano JavaScript library for Zendesk Help Center (part of Zendesk Guide) that contains a collection of useful methods that may help automating routine dev tasks.

## how to load

For the latest version

```
<script src="https://cdn.jsdelivr.net/gh/sarapulov/zg/zg.min.js"></script>
```

For more specific version

```
<script src="https://cdn.jsdelivr.net/gh/sarapulov/zg@1.0.8/zg.min.js"></script>
```

## how to use


Load the library to Help Center pages and the use one of the following methods after a page is loaded.


```
document.addEventListener('DOMContentLoaded', function() {

	if (zg().hasAnyUserTag(['test','/office:/'])) {
		console.log('This is a test user!');
	}

})
```

## methods

```

["zg().help()"]											:"return the list of available methods",
["zg().version"]										: "return current version of the 'zg' library",
["zg().isTicketFormSelectorPage()"]						: "TRUE if current page is a form selector page",
["zg().isTicketFormPage()"]								: "TRUE if current page is the actual ticket form",
["zg().getTicketFormID()"]								: "return currently selected ticket form ID as a string",
["zg().isThisTheFormID('12345')"]						: "TRUE if passed ID is matching the current ticket form ID",
["zg().hasAnyUserTag(['test','/office:/'])"]			: "TRUE if current user has at least one of the tags OR at least one tag is matching the pattern",
["zg().hasAllUserTag(['test','/office:/'])"]			: "TRUE if current user has all tags OR all tags are matching the pattern",
["zg().hasUserNoneOfTheseTags(['test','/office:/'])"]	: "TRUE if current user has none of tags OR no tags are matching the pattern",
["zg().getUserLocale()"]								: "return current user locale from Help Center HTML",
["zg().getAllTicketFormIDs()"]							: "return all available ticket form IDs. Should be used on the new_request_page.hbs",
["zg().hideTicketFormIDs(['123','456'])"]				: "will hide listed ticket form IDs from the Ticket Form Selector excluding currrently selected ticket form",
["zg().ifUrlContainsAny(['en','us'])"]					: "TRUE if either of the strings are available in the current URL. window.location.href is used to define the URL",
["zg().ifUrlContainsAll(['en','us'])"]					: "TRUE if all of the strings are available in the current URL. window.location.href is used to define the URL",
["zg().isVisitorLogin()"]								: "TRUE if current visitor is login to Help Center. Should be called after page is loaded.",
["zg().isAgentMemberOfAnyGroups(['Group 1','/Group/'])"]: "TRUE if current Agent is a member of any Group or Group name is matching the pattern",
["zg().isAgentMemberOfAllGroups(['Group 1','/Group/'])"]: "TRUE if current Agent is a member of all Groups or Group name is matching the pattern",
["zg().setTicketFieldAttribbutes([{
			"field_id":"request_description",
			"label":"MY FIELD LABEL",
			"help_text":"MY FIELD HELP TEXT"}
		])
		"]: "Sets ticket field label and/or help text on a ticket form. tested with the following field ids: request_description, request_subject, request_custom_fields_XXXXXX, request_organization_id, request_collaborators_, request_issue_type_select"

```

## examples

```
zg().setTicketFieldAttribbutes([{
	"field_id":"request_description",
	"label":"MY DESCRPTION LABEL",
	"help_text":"MY DESCRPTION HELP TEXT"
},
{
	"field_id":"request_custom_fields_24156879",
	"label":"MY FIELD LABEL",
	"help_text":"MY FIELD HELP TEXT"
},
{
	"field_id":"request_organization_id",
	"label":"MY ORG FIELD LABEL",
	"help_text":"MY ORG FIELD HELP TEXT"
},

{
	"field_id":"request_custom_fields_23156796",
	"label":"MY LABEL FOR TEXT",
	"help_text":"MY HELP TEXT FOR TEXT"
},
{
	"field_id":"request_collaborators_",
	"label":"MY LABEL FOR CC",
	"help_text":"MY HELP TEXT FOR CC"
},
{
	"field_id":"request_issue_type_select",
	"label":"MY LABEL FOR TICKET FORM",
	"help_text":"MY HELP TEXT FOR TICKET FORM"
},
{
	"field_id":"request_subject",
	"label":"MY LABEL FOR SUBJECT",
	"help_text":"MY HELP TEXT FOR SUBJECT"
}]);
```