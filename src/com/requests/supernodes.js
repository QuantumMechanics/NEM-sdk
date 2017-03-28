import Request from 'request';
import Nodes from '../../model/nodes';

/**
 * Gets all nodes of the node reward program
 *
 * @return {array} - An array of SuperNodeData objects
 */
let all = function(){
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Nodes.supernodes,
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
	all
}