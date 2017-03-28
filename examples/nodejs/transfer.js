// Include the library
var nem = require("../../build/index.js").default;

// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

// Create a common object holding key
var common = nem.model.objects.create("common")("", "Private key");

// Create an un-prepared transfer transaction object
var transferTransaction = nem.model.objects.create("transferTransaction")("TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S", 10, "Hello");

// Prepare the transfer transaction object
var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

// Serialize transfer transaction and announce
nem.model.transactions.send(common, transactionEntity, endpoint);