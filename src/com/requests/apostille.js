import Request from 'request';
import Nodes from '../../model/nodes';

let urlEncodedHeader = {
	'Content-Type': 'application/x-www-form-urlencoded'
}

/**
 * Audit an apostille file
 *
 * @param {string} publicKey - The signer public key
 * @param {string} data - The file data of audited file
 * @param {string} signedData - The signed data into the apostille transaction message
 *
 * @return {boolean} - True if valid, false otherwise
 */
let audit = function(publicKey, data, signedData) {
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Nodes.apostilleAuditServer,
		    method: 'POST',
		    headers: urlEncodedHeader,
		    qs: {'publicKey': publicKey, 'data': data,'signedData': signedData}
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
	audit
}