// Include the library
var nem = require("../../../build/index.js").default;

// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

// Simulate the file content
var fileContent = nem.crypto.js.enc.Utf8.parse('Apostille is awesome !');

// Transaction hash of the Apostille
var txHash = "5e7c54e47372659b4ae27e500d48e4514e827d8f6e1b88f07bdbc8c53e471422";

// Get the Apostille transaction from the chain
nem.com.requests.transaction.byHash(endpoint, txHash).then(function(res) {
	// Verify
	if (nem.model.apostille.verify(fileContent, res.transaction)) {
		console.log("Apostille is valid");
	} else {
	    console.log("Apostille is invalid");
	}
}, function(err) {
	console.log("Apostille is invalid");
	console.log(err);
});