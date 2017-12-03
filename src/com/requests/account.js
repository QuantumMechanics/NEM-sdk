import Helpers from '../../utils/helpers';
import Headers from './headers';
import Send from './send';

/**
 * Gets the AccountMetaDataPair of an account.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {object} - An [AccountMetaDataPair]{@link http://bob.nem.ninja/docs/#accountMetaDataPair} object
 */
let data = function(endpoint, address) {
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/get',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: {'address': address}
	}
	// Send the request
	return Send(options);
}

/**
 * Gets the AccountMetaDataPair of an account with a public Key.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} publicKey - An account public key
 *
 * @return {object} - An [AccountMetaDataPair]{@link http://bob.nem.ninja/docs/#accountMetaDataPair} object
 */
let dataFromPublicKey = function(endpoint, publicKey) {
	// Configure the public key request
	const options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/get/from-public-key',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: {'publicKey': publicKey}
	}
	// Send the request
	return Send(options);
}

/**
 * Gets an array of harvest info objects for an account.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {array} - An array of [HarvestInfo]{@link http://bob.nem.ninja/docs/#harvestInfo} objects
 */
let harvestedBlocks = function(endpoint, address){
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/harvests',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: {'address': address}
	}
	// Send the request
	return Send(options);
}

/**
 * Gets an array of TransactionMetaDataPair objects where the recipient has the address given as parameter to the request.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 * @param {string} txHash - The 256 bit sha3 hash of the transaction up to which transactions are returned. (optional)
 * @param {string} txId - The transaction id up to which transactions are returned. (optional)
 *
 * @return {array} - An array of [TransactionMetaDataPair]{@link http://bob.nem.ninja/docs/#transactionMetaDataPair} objects
 */
let incomingTransactions = function(endpoint, address, txHash, txId){
	// Arrange
	let params = {'address': address};
	if (txHash) params['hash'] = txHash;
	if (txId) params['id'] = txId;

	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/transfers/incoming',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: params
	}
	// Send the request
	return Send(options);
}

/**
 * Gets an array of TransactionMetaDataPair objects where the sender has the address given as parameter to the request.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 * @param {string} txHash - The 256 bit sha3 hash of the transaction up to which transactions are returned. (optional)
 * @param {string} txId - The transaction id up to which transactions are returned. (optional)
 *
 * @return {array} - An array of [TransactionMetaDataPair]{@link http://bob.nem.ninja/docs/#transactionMetaDataPair} objects
 */
let outgoingTransactions = function(endpoint, address, txHash, txId){
	// Arrange
	let params = {'address': address};
	if (txHash) params['hash'] = txHash;
	if (txId) params['id'] = txId;

	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/transfers/outgoing',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: params
	}
	// Send the request
	return Send(options);
}

/**
 * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {array} - An array of [UnconfirmedTransactionMetaDataPair]{@link http://bob.nem.ninja/docs/#unconfirmedTransactionMetaDataPair} objects
 */
let unconfirmedTransactions = function(endpoint, address){
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/unconfirmedTransactions',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: {'address': address}
	}
	// Send the request
	return Send(options);
}

/**
 * Gets information about the maximum number of allowed harvesters and how many harvesters are already using the node
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} - An [UnlockInfo]{@link http://bob.nem.ninja/docs/#retrieving-the-unlock-info} object
 */
let unlockInfo = function(endpoint) {
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/unlocked/info',
	    method: 'POST',
	    headers: Headers.urlEncoded
	}
	// Send the request
	return Send(options);
};

/**
 * Unlocks an account (starts harvesting).
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} privateKey - A delegated account private key
 *
 * @return - Nothing
 */
let startHarvesting = function(endpoint, privateKey){
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/unlock',
	    method: 'POST',
	    json: true,
		body: {'value': privateKey}
	}
	// Send the request
	return Send(options);
};

 /**
 * Locks an account (stops harvesting).
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} privateKey - A delegated account private key
 *
 * @return - Nothing
 */
let stopHarvesting = function(endpoint, privateKey){
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/lock',
	    method: 'POST',
	    json: true,
		body: {'value': privateKey}
	}
	// Send the request
	return Send(options);
};

/**
 * Gets the AccountMetaDataPair of the account for which the given account is the delegate account
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {object} - An [AccountMetaDataPair]{@link http://bob.nem.ninja/docs/#accountMetaDataPair} object
 */
let forwarded = function(endpoint, address) {
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/get/forwarded',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: {'address': address}
	}
	// Send the request
	return Send(options);
}

/**
 * Gets namespaces that an account owns
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 * @param {string} parent - The namespace parent (optional)
 *
 * @return {object} - An array of [NamespaceMetaDataPair]{@link http://bob.nem.ninja/docs/#namespaceMetaDataPair} objects
 */
let namespacesOwned = function(endpoint, address, parent){
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/namespace/page',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: { 'address': address, 'parent': parent || ""}
	}
	// Send the request
	return Send(options);
}

/**
 * Gets mosaic definitions that an account has created
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 * @param {string} parent - The namespace parent (optional)
 *
 * @return {object} - An array of [MosaicDefinition]{@link http://bob.nem.ninja/docs/#mosaicDefinition} objects
 */
let mosaicDefinitionsCreated = function(endpoint, address, parent){
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/mosaic/definition/page',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: { 'address': address, 'parent': parent || ""}
	}
	// Send the request
	return Send(options);
}

/**
 * Gets mosaic definitions that an account owns
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {array} - An array of [MosaicDefinition]{@link http://bob.nem.ninja/docs/#mosaicDefinition} objects
 */
let mosaicDefinitions = function(endpoint, address){
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/mosaic/owned/definition',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: { 'address': address }
	}
	// Send the request
	return Send(options);
}

/**
 * Gets mosaics that an account owns
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {array} - An array of [Mosaic]{@link http://bob.nem.ninja/docs/#mosaic} objects
 */
let mosaicsOwned = function(endpoint, address){
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/mosaic/owned',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: { 'address': address }
	}
	// Send the request
	return Send(options);
}

/**
 * Gets all transactions of an account
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 * @param {string} txHash - The 256 bit sha3 hash of the transaction up to which transactions are returned. (optional)
 * @param {string} txId - The transaction id up to which transactions are returned. (optional)
 *
 * @return {array} - An array of [TransactionMetaDataPair]{@link http://bob.nem.ninja/docs/#transactionMetaDataPair} objects
 */
let allTransactions = function(endpoint, address, txHash, txId){
	// Arrange
	let params = {'address': address};
	if (txHash) params['hash'] = txHash;
	if (txId) params['id'] = txId;

	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/account/transfers/all',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: params
	}
	// Send the request
	return Send(options);
}

module.exports = {
	data,
	dataFromPublicKey,
	unlockInfo,
	forwarded,
	mosaics: {
		owned: mosaicsOwned,
		definitions: mosaicDefinitionsCreated,
		allDefinitions: mosaicDefinitions
	},
	namespaces: {
		owned: namespacesOwned
	},
	harvesting: {
		blocks: harvestedBlocks,
		start: startHarvesting,
		stop: stopHarvesting
	},
	transactions: {
		incoming: incomingTransactions,
		outgoing: outgoingTransactions,
		unconfirmed: unconfirmedTransactions,
		all: allTransactions
	}
}