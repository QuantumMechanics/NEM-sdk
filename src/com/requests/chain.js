import Send from './send';
import Helpers from '../../utils/helpers';

/**
 * Gets the current height of the block chain.
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} - A [BlockHeight]{@link http://bob.nem.ninja/docs/#block-chain-height} object
 */
const height = function (endpoint) {
  // Configure the request
  const options = {
    url: `${Helpers.formatEndpoint(endpoint)}/chain/height`,
    method: 'GET',
  };
  // Send the request
  return Send(options);
};

/**
 * Gets the current last block of the chain.
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} -
 */
const lastBlock = function (endpoint) {
  // Configure the request
  const options = {
    url: `${Helpers.formatEndpoint(endpoint)}/chain/last-block`,
    method: 'GET',
  };
  // Send the request
  return Send(options);
};

/**
 * Gets network time (in ms)
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} - A [communicationTimeStamps]{@link http://bob.nem.ninja/docs/#communicationTimeStamps} object
 */
const time = function (endpoint) {
  // Configure the request
  const options = {
    url: `${Helpers.formatEndpoint(endpoint)}/time-sync/network-time`,
    method: 'GET',
  };
  // Send the request
  return Send(options);
};

module.exports = {
  height,
  lastBlock,
  time,
};
