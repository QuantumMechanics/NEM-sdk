import Helpers from '../../utils/helpers';
import Request from 'request';

/**
 * Send a request
 *
 * @param {object} options - The options of the request
 *
 * @return {Promise} - A resolved promise with the requested data or a rejection with error data
 */
let send = function(options) {
	return new Promise((resolve, reject) => {
		Request(options, function (error, response, body) {
			let data;
			if(Helpers.isJSON(body)) {
			    data = JSON.parse(body);
			} else {
			    data = body;
			}
		    if (!error && response.statusCode == 200) {
		        resolve(data);
		    } else {
		    	if(!error) {
		    		reject({"code": 0, "data": data});
		    	} else {
		    		reject({"code": -1, "data": error});
		    	}
		    }
		});
	});
}

export default send;