import Send from './send';
import Headers from './headers';
import Nodes from '../../model/nodes';

/**
 * Gets market information from Poloniex api
 *
 * @return {object} - A MarketInfo object
 */
let xem = function(){
	// Configure the request
	var options = {
	    url: Nodes.marketInfo,
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: {'command': 'returnTicker'}
	}
	// Send the request
	return Send(options);
};

/**
 * Gets BTC price from blockchain.info API
 *
 * @return {object} - A MarketInfo object
 */
let btc = function(){
	// Configure the request
	var options = {
	    url: Nodes.btcPrice,
	    method: 'GET',
	    headers: Headers.urlEncoded,
	    qs: {'cors': true}
	}
	// Send the request
	return Send(options);
};

module.exports = {
	xem,
	btc
}