var nem = require("../../build/index.js").default;

// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

// Address we'll use in some queries
var address = "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S";

// Get chain height
nem.com.requests.chain.height(endpoint).then(function(res) {
	console.log("\nChain Height:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get account data
nem.com.requests.account.data(endpoint, address).then(function(res) {
	console.log("\nAccount data:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get harvested blocks
nem.com.requests.account.harvesting.blocks(endpoint, address).then(function(res) {
	console.log("\nHarvested blocks:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get namespace info
nem.com.requests.namespace.info(endpoint, "nw").then(function(res) {
	console.log("\nNamespace info:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get mosaic definitions of a namespace or sub-namespace
nem.com.requests.namespace.mosaicDefinitions(endpoint, "nw.fiat").then(function(res) {
	console.log("\nMosaic definitions:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get incoming transactions
nem.com.requests.account.transactions.incoming(endpoint, address).then(function(res) {
	console.log("\nIncoming transactions:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get unconfirmed transactions
nem.com.requests.account.transactions.unconfirmed(endpoint, address).then(function(res) {
	console.log("\nUnconfirmed transactions:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Audit an apostille
var data = "a7989d7da532230414a0bbbbcc3efa08c1655a91cb99b43971246342ea32ef57";
var publicKey = "0257b05f601ff829fdff84956fb5e3c65470a62375a1cc285779edd5ca3b42f6";
var signedData = "99e8a55a65cf6a7913ac4fcacd9be0dd91a06b556faadc6a2baddc5bf639eba6e96050e931be083f819b1fbdab67345d418537f7314b36eea64e3244b3213b0b";

nem.com.requests.apostille.audit(publicKey, data, signedData).then(function(res) {
	console.log("\nApostille audit result:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get unlock info
nem.com.requests.account.unlockInfo(endpoint).then(function(res) {
	console.log("\nUnlock info:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Start harvesting for an account
var privateKey = "05fb0e2f6e4e6b06fb13906ced18c11544dc61a1de0c585663ba6abd35a41d08";
nem.com.requests.account.harvesting.start(endpoint, privateKey).then(function(res) {
	console.log("\nUnlock account:");
	console.log(res);
}, function(err) {
	console.log("\nUnlock account:");
	console.error(err);
});

// Stop harvesting for an account
nem.com.requests.account.harvesting.stop(endpoint, privateKey).then(function(res) {
	console.log("\nLock account:");
	console.log(res);
}, function(err) {
	console.log("\nLock account:");
	console.error(err);
});

// Get BTC/XEM market information
nem.com.requests.market.xem().then(function(res) {
	console.log("\nXEM to BTC market info:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get BTC to USD market information
nem.com.requests.market.btc().then(function(res) {
	console.log("\nBTC to USD market info:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get endpoint heartbeat
nem.com.requests.endpoint.heartbeat(endpoint).then(function(res) {
	console.log("\nEndpoint heartbeat:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get a transaction by hash
var txHash = "161d7f74ab9d332acd46f96650e74371d65b6e1a0f47b076bdd7ccea37903175";
// Create another endpoint because this request need special nodes
var searchEnabledEndpoint = nem.model.objects.create("endpoint")(nem.model.nodes.searchOnTestnet[0].uri, nem.model.nodes.defaultPort);
nem.com.requests.transaction.byHash(searchEnabledEndpoint, txHash).then(function(res) {
	console.log("\nTransaction data:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get account for which the given account is the delegate account
var delegatedAccount = "TD6U6OTDK5ZRAZCSZ4653IT6OMOZ3KEIOZ2BNWJP";
nem.com.requests.account.forwarded(endpoint, delegatedAccount).then(function(res) {
	console.log("\nAccount forwarded:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get 100 firsts namespaces 
nem.com.requests.namespace.roots(endpoint).then(function(res) {
	console.log("\nNamespaces:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get namespaces owned by account
nem.com.requests.account.namespaces.owned(endpoint, address).then(function(res) {
	console.log("\nNamespaces of account:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get all transactions of account
nem.com.requests.account.transactions.all(endpoint, address).then(function(res) {
	console.log("\nAll transactions of the account:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get blockchain time
nem.com.requests.chain.time(endpoint).then(function(res) {
	console.log("\nNetwork time:");
	console.log(res);
}, function(err) {
	console.error(err);
});

// Get all supernodes
nem.com.requests.supernodes.all().then(function(res) {
	console.log("\nSupernodes:");
	console.log(res);
}, function(err) {
	console.error(err);
});