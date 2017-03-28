import Request from 'request';
import Helpers from '../../utils/helpers';

let urlEncodedHeader = {
	'Content-Type': 'application/x-www-form-urlencoded'
}

/**
 * Gets root namespaces.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {number} id - The namespace id up to which root namespaces are returned (optional)
 *
 * @return {object} - An array of [NamespaceMetaDataPair]{@link http://bob.nem.ninja/docs/#namespaceMetaDataPair} objects
 */
let roots = function(endpoint, id){
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/namespace/root/page',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: undefined === id ? {'pageSize': 100} : { 'id': id, 'pageSize':100}
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
 * Gets mosaic definitions of a namespace
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} id - The namespace Id
 *
 * @return {object} - An array of [MosaicDefinition]{@link http://bob.nem.ninja/docs/#mosaicDefinition} objects
 */
let mosaicDefinitions = function(endpoint, id){
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/namespace/mosaic/definition/page',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: {'namespace': id}
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
 * Gets the namespace with given id.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} id - A namespace id
 *
 * @return {object} - A [NamespaceInfo]{@link http://bob.nem.ninja/docs/#namespace} object
 */
let info = function(endpoint, id) {
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/namespace',
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: {'namespace': id}
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
	roots,
	mosaicDefinitions,
	info
}