// Include the library
var nem = require("../../build/index.js").default;

// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

// Create a common object holding key 
var common = nem.model.objects.create("common")("", "Private key");

// Create variable to store our mosaic definitions, needed to calculate fees properly (already contains xem definition)
var mosaicDefinitionMetaDataPair = nem.model.objects.get("mosaicDefinitionMetaDataPair");

// Create an un-prepared mosaic transfer transaction object (use same object as transfer tansaction)
var transferTransaction = nem.model.objects.create("transferTransaction")("TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S", 1, "Hello");

/**
 * ATTACHING XEM MOSAIC
 *
 * No need to get mosaic definition because it is already known in the mosaicdefinitionMetaDatapair
 */

// Create a mosaic attachment object
var mosaicAttachment = nem.model.objects.create("mosaicAttachment")("nem", "xem", 1000000);

// Push attachment into transaction mosaics
transferTransaction.mosaics.push(mosaicAttachment);

/**
 * ATTACHING ANOTHER MOSAIC
 *
 * Need to get mosaic definition using com.requests
 */

// Create another mosaic attachment
var mosaicAttachment2 = nem.model.objects.create("mosaicAttachment")("nw.fiat", "eur", 10000); // 100 nw.fiat.eur (divisibility is 2 for this mosaic)

// Push attachment into transaction mosaics
transferTransaction.mosaics.push(mosaicAttachment2);

// Need mosaic definition of nw.fiat:eur to calculate adequate fees, so we get it from network.
// Otherwise you can simply take the mosaic definition from api manually (http://bob.nem.ninja/docs/#retrieving-mosaic-definitions) 
// and put it into mosaicDefinitionMetaDataPair model (objects.js) next to nem:xem (be careful to respect object structure)
nem.com.requests.namespace.mosaicDefinitions(endpoint, mosaicAttachment2.mosaicId.namespaceId).then(function(res) {

	// Look for the mosaic definition(s) we want in the request response (Could use ["eur", "usd"] to return eur and usd mosaicDefinitionMetaDataPairs)
	var neededDefinition = nem.utils.helpers.searchMosaicDefinitionArray(res.data, ["eur"]);
	
	// Get full name of mosaic to use as object key
	var fullMosaicName  = nem.utils.format.mosaicIdToName(mosaicAttachment2.mosaicId);

	// Check if the mosaic was found
	if(undefined === neededDefinition[fullMosaicName]) return console.error("Mosaic not found !");

	// Set eur mosaic definition into mosaicDefinitionMetaDataPair
	mosaicDefinitionMetaDataPair[fullMosaicName] = {};
	mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition = neededDefinition[fullMosaicName];

	// Prepare the transfer transaction object
	var transactionEntity = nem.model.transactions.prepare("mosaicTransferTransaction")(common, transferTransaction, mosaicDefinitionMetaDataPair, nem.model.network.data.testnet.id);

	// Serialize transfer transaction and announce
	nem.model.transactions.send(common, transactionEntity, endpoint)
}, 
function(err) {
	console.error(err);
});
