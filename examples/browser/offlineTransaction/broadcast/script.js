$(document).ready(function () {

	// Load nem-browser library
	var nem = require("nem-sdk").default;

    // Create an NIS endpoint object
	var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

	/**
     * Send transaction
     */
	function send() {
		// Check form for errors
		if(!$("#transaction").val()) return alert('Missing parameter !');

		// Send
		nem.com.requests.transaction.announce(endpoint, $("#transaction").val()).then(function(res) {
			// If code >= 2, it's an error
			if (res.code >= 2) {
				alert(res.message);
			} else {
				alert(res.message);
			}
		}, function(err) {
			alert(err);
		})
	}

	// Call send function when click on send button
	$("#send").click(function() {
	  send();
	});

});