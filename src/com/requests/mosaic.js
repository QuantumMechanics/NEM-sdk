import Send from './send';
import Headers from './headers';
import Helpers from '../../utils/helpers';

/**
 * Gets the current supply of a mosaic
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} id - A mosaic id
 *
 * @return {object} - A mosaicSupplyInfo object
 */
let supply = function(endpoint, id) {
	// Configure the request
	var options = {
	    url: Helpers.formatEndpoint(endpoint) + '/mosaic/supply',
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: {'mosaicId': id}
	}
	// Send the request
	return Send(options);
}

module.exports = {
	supply
}