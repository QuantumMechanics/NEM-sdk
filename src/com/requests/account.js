import Request from 'request';
import Helpers from '../../utils/helpers';

let urlEncodedHeader = {
	'Content-Type': 'application/x-www-form-urlencoded'
}

/**
 * Gets the AccountMetaDataPair of an account.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {object} - An [AccountMetaDataPair]{@link http://bob.nem.ninja/docs/#accountMetaDataPair} object
 */
let data = function(endpoint, address) {
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/account/get',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: {'address': address}
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body));
		    } else {
		    	reject(error);
		    }
		});
	});
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
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/account/harvests',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: {'address': address}
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body).data);
		    } else {
		    	reject(error);
		    }
		});
	});
}

/**
 * Gets an array of TransactionMetaDataPair objects where the recipient has the address given as parameter to the request.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 * @param {string} txHash - A starting hash for search (optional)
 * @param {string} txId - A starting ID (optional)
 *
 * @return {array} - An array of [TransactionMetaDataPair]{@link http://bob.nem.ninja/docs/#transactionMetaDataPair} objects
 */
let incomingTransactions = function(endpoint, address, txHash, txId){
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/account/transfers/incoming',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: {'address': address, 'hash': txHash || '', 'id': txId || ''}
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body).data);
		    } else {
		    	reject(error);
		    }
		});
	});
}

/**
 * Gets an array of TransactionMetaDataPair objects where the sender has the address given as parameter to the request.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 * @param {string} txHash - A starting hash for search (optional)
 * @param {string} txId - A starting ID (optional)
 *
 * @return {array} - An array of [TransactionMetaDataPair]{@link http://bob.nem.ninja/docs/#transactionMetaDataPair} objects
 */
let outgoingTransactions = function(endpoint, address, txHash, txId){
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/account/transfers/outgoing',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: {'address': address, 'hash': txHash || '', 'id': txId || ''}
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body).data);
		    } else {
				reject(error);
		    }
		});
	});
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
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/account/unconfirmedTransactions',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: {'address': address}
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body).data);
		    } else {
		    	reject(error);
		    }
		});
	});
}

/**
 * Gets information about the maximum number of allowed harvesters and how many harvesters are already using the node
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} - An [UnlockInfo]{@link http://bob.nem.ninja/docs/#retrieving-the-unlock-info} object
 */
let unlockInfo = function(endpoint) {
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/account/unlocked/info',
		    method: 'POST',
		    headers: urlEncodedHeader
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body));
		    } else {
		    	reject(error);
		    }
		});
	});
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
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/account/unlock',
		    method: 'POST',
		    headers: urlEncodedHeader,
		    qs: {'value': privateKey}
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body));
		    } else {
		    	reject(error);
		    }
		});
	});
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
    return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/account/lock',
		    method: 'POST',
		    headers: urlEncodedHeader,
		    qs: {'value': privateKey}
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body));
		    } else {
		    	reject(error);
		    }
		});
	});
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
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/account/get/forwarded',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: {'address': address}
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body));
		    } else {
		    	reject(error);
		    }
		});
	});
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
let namespaces = function(endpoint, address, parent){
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/account/namespace/page',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: { 'address': address, 'parent': parent || ""}
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body).data);
		    } else {
		    	reject(error);
		    }
		});
	});
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
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/account/mosaic/definition/page',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: { 'address': address, 'parent': parent || ""}
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body));
		    } else {
		    	reject(error);
		    }
		});
	});
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
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/account/mosaic/owned/definition',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: { 'address': address }
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body));
		    } else {
		    	reject(error);
		    }
		});
	});
}

/**
 * Gets mosaics that an account owns
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {array} - An array of [Mosaic]{@link http://bob.nem.ninja/docs/#mosaic} objects
 */
let mosaics = function(endpoint, address){
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/account/mosaic/owned',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: { 'address': address }
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body));
		    } else {
		    	reject(error);
		    }
		});
	});
}

/**
 * Gets all transactions of an account
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 * @param {string} txHash - A starting hash (optional)
 * @param {string} txId - A starting ID (optional)
 *
 * @return {array} - An array of [TransactionMetaDataPair]{@link http://bob.nem.ninja/docs/#transactionMetaDataPair} objects
 */
let allTransactions = function(endpoint, address, txHash, txId){
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/account/transfers/all',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: { 'address': address, 'hash': txHash || '', 'id': txId || '' }
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body).data);
		    } else {
		    	reject(error);
		    }
		});
	});
}

module.exports = {
	data,
	harvestedBlocks,
	incomingTransactions,
	unconfirmedTransactions,
	unlockInfo,
	stopHarvesting,
	startHarvesting,
	forwarded,
	namespaces,
	mosaicDefinitionsCreated,
	mosaicDefinitions,
	mosaics,
	allTransactions,
	outgoingTransactions
}