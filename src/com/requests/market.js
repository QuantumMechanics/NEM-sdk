import Request from 'request';
import Nodes from '../../model/nodes';

let urlEncodedHeader = {
	'Content-Type': 'application/x-www-form-urlencoded'
}

/**
 * Gets market information from Poloniex api
 *
 * @return {object} - A MarketInfo object
 */
let xem = function(){
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Nodes.marketInfo,
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: {'command': 'returnTicker'}
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body)["BTC_XEM"]);
		    } else {
		    	reject(error);
		    }
		});
	});
};

/**
 * Gets BTC price from blockchain.info API
 *
 * @return {object} - A MarketInfo object
 */
let btc = function(){
	return new Promise((resolve, reject) => {
		// Configure the request
		var options = {
		    url: Nodes.btcPrice,
		    method: 'GET',
		    headers: urlEncodedHeader,
		    qs: {'cors': true}
		}

		// Start the request
		Request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        resolve(JSON.parse(body)["USD"]);
		    } else {
		    	reject(error);
		    }
		});
	});
};

module.exports = {
	xem,
	btc
}