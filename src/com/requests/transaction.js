import Request from 'request';
import Helpers from '../../utils/helpers';

let urlEncodedHeader = {
	'Content-Type': 'application/x-www-form-urlencoded'
}

let jsonHeader = function(data) {
	return {
		"Content-Type": "application/json",
	    "Content-Length": Buffer.from(data).byteLength
	}
}

/**
 * Broadcast a transaction to the NEM network
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {object} obj - A RequestAnnounce object
 *
 * @return {object} - A [NemAnnounceResult]{@link http://bob.nem.ninja/docs/#nemAnnounceResult} object
 */
let announce = function(endpoint, serializedTransaction) {
    return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/transaction/announce',
		    method: 'POST',
		    headers: jsonHeader(serializedTransaction),
		    json: JSON.parse(serializedTransaction)
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(body);
		    } else {
		    	reject(error);
		    }
		});
	});
}

/**
 * Gets a TransactionMetaDataPair object from the chain using it's hash
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} txHash - A transaction hash
 *
 * @return {object} - A [TransactionMetaDataPair]{@link http://bob.nem.ninja/docs/#transactionMetaDataPair} object
 */
let byHash = function(endpoint, txHash){
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/transaction/get',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: {'hash': txHash}
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

module.exports = {
	announce,
	byHash
}