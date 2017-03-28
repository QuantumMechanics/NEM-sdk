import Request from 'request';
import Helpers from '../../utils/helpers';

/**
 * Gets the current height of the block chain.
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} - A [BlockHeight]{@link http://bob.nem.ninja/docs/#block-chain-height} object
 */
let height = function (endpoint) {
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/chain/height',
		    method: 'GET'
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
 * Gets the current last block of the chain.
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} -
 */
let lastBlock = function(endpoint){
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/chain/last-block',
		    method: 'GET'
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
 * Gets network time (in ms)
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} - A [communicationTimeStamps]{@link http://bob.nem.ninja/docs/#communicationTimeStamps} object
 */
let time = function (endpoint) {
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/time-sync/network-time',
		    method: 'GET'
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
	height,
	lastBlock,
	time
}