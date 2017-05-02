// Include the library
var nem = require("../../../build/index.js").default;

// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

// Simulate the file content
var fileContent = nem.crypto.js.enc.Utf8.parse('Apostille is awesome !');

// Transaction hash of the Apostille
var txHash = "4c665fdb1b9569eca3f2f7ccc78dd6252a4ad95cd1fafe6fa39be66ea77558d5";

// Get the Apostille transaction from the chain
nem.com.requests.transaction.byHash(endpoint, txHash).then(function(res) {
	console.log("Is apostille valid ?")
	console.log(nem.model.apostille.verify(fileContent, res.transaction));
}, function(err) {
	console.log(err);
	console.log(false);
});