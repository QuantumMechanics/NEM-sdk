import Send from './send';
import Headers from './headers';
import Helpers from '../../utils/helpers';

/**
 * Gets root namespaces.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {number} id - The namespace id up to which root namespaces are returned (optional)
 *
 * @return {object} - An array of [NamespaceMetaDataPair]{@link http://bob.nem.ninja/docs/#namespaceMetaDataPair} objects
 */
let roots = function(endpoint, id){
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/namespace/root/page',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: undefined === id ? {'pageSize': 100} : { 'id': id, 'pageSize':100}
	}
	// Send the request
	return Send(options);
}

/**
 * Gets mosaic definitions of a namespace
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} id - A namespace id
 *
 * @return {object} - An array of [MosaicDefinition]{@link http://bob.nem.ninja/docs/#mosaicDefinition} objects
 */
let mosaicDefinitions = function(endpoint, id){
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/namespace/mosaic/definition/page',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: {'namespace': id}
	}
	// Send the request
	return Send(options);
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
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/namespace',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: {'namespace': id}
	}
	// Send the request
	return Send(options);
}

module.exports = {
	roots,
	mosaicDefinitions,
	info
}