import Send from './send';
import Headers from './headers';
import Nodes from '../../model/nodes';

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
	// Configure the request
	var options = {
	    url: Nodes.apostilleAuditServer,
	    method: 'POST',
	    headers: Headers.urlEncoded,
	    qs: {'publicKey': publicKey, 'data': data,'signedData': signedData}
	}
	// Send the request
	return Send(options);
}

module.exports = {
	audit
}