import Send from './send';
import Headers from './headers';
import Nodes from '../../model/nodes';

/**
 * Gets market information from Poloniex api
 *
 * @return {object} - A MarketInfo object
 */
const xem = function () {
  // Configure the request
  const options = {
    url: Nodes.marketInfo,
    method: 'GET',
    headers: Headers.urlEncoded,
    qs: { command: 'returnTicker' },
  };
  // Send the request
  return Send(options);
};

/**
 * Gets BTC price from blockchain.info API
 *
 * @return {object} - A MarketInfo object
 */
const btc = function () {
  // Configure the request
  const options = {
    url: Nodes.btcPrice,
    method: 'GET',
    headers: Headers.urlEncoded,
    qs: { cors: true },
  };
  // Send the request
  return Send(options);
};

module.exports = {
  xem,
  btc,
};
