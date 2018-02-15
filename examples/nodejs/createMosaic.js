// Include the library
var nem = require("../../build/index.js").default;

// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

// Create a common object holding key 
var common = nem.model.objects.create("common")("", "Private key");

// Get a MosaicDefinitionCreationTransaction object
var tx = nem.model.objects.get("mosaicDefinitionTransaction");

// Define the mosaic
tx.mosaicName = "myMosaic";
tx.namespaceParent = {
	"fqn": "nano.example"
};
tx.mosaicDescription = "My mosaic";

// Set properties (see https://nemproject.github.io/#mosaicProperties)
tx.properties.initialSupply = 5000000;
tx.properties.divisibility = 2;
tx.properties.transferable = true;
tx.properties.supplyMutable = true;

// Prepare the transaction object
var transactionEntity = nem.model.transactions.prepare("mosaicDefinitionTransaction")(common, tx, nem.model.network.data.testnet.id);

// Serialize transaction and announce
nem.model.transactions.send(common, transactionEntity, endpoint)