import Send from './send';
import Headers from './headers';
import Helpers from '../../utils/helpers';

/**
 * Broadcast a transaction to the NEM network
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {object} obj - A RequestAnnounce object
 *
 * @return {object} - A [NemAnnounceResult]{@link http://bob.nem.ninja/docs/#nemAnnounceResult} object
 */
let announce = function(endpoint, serializedTransaction) {
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/transaction/announce',
	    method: 'POST',
	    headers: Headers.json(serializedTransaction),
	    json: JSON.parse(serializedTransaction)
	}
	// Send the request
	return Send(options);
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
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/transaction/get',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: {'hash': txHash}
	}
	// Send the request
	return Send(options);
}

module.exports = {
	announce,
	byHash
}