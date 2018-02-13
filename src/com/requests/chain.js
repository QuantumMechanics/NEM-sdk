import Send from './send';
import Helpers from '../../utils/helpers';

/**
 * Gets the current height of the block chain.
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} - A [BlockHeight]{@link http://bob.nem.ninja/docs/#block-chain-height} object
 */
let height = function (endpoint) {
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/chain/height',
	    method: 'GET'
	}
	// Send the request
	return Send(options);
}

/**
 * Gets the current last block of the chain.
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} -
 */
let lastBlock = function(endpoint){
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/chain/last-block',
	    method: 'GET'
	}
	// Send the request
	return Send(options);
}

/**
 * Gets network time (in ms)
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} - A [communicationTimeStamps]{@link http://bob.nem.ninja/docs/#communicationTimeStamps} object
 */
let time = function (endpoint) {
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/time-sync/network-time',
	    method: 'GET'
	}
	// Send the request
	return Send(options);
}

/**
 * Gets a block by its height
 *
 * @param {string} endpoint - An NIS endpoint object
 * @param {integer} height - The height of the block
 *
 * @return {object} - A block object
 */
let blockByHeight = function(endpoint, height){
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/block/at/public',
	    method: 'POST',
	    json: true,
		body: {'height': height}
	}
	// Send the request
	return Send(options);
};

module.exports = {
	height,
	lastBlock,
	time,
	blockByHeight
}