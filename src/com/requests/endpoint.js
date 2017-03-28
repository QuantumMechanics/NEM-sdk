import Request from 'request';
import Helpers from '../../utils/helpers';

/**
 * Determines if NIS is up and responsive.
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} - A [NemRequestResult]{@link http://bob.nem.ninja/docs/#nemRequestResult} object
 */
let heartbeat = function(endpoint) {
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Helpers.formatEndpoint(endpoint) + '/heartbeat',
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
};

module.exports = {
	heartbeat
}