import Send from './send';
import Helpers from '../../utils/helpers';

/**
 * Determines if NIS is up and responsive.
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} - A [NemRequestResult]{@link http://bob.nem.ninja/docs/#nemRequestResult} object
 */
const heartbeat = function (endpoint) {
  // Configure the request
  const options = {
    url: `${Helpers.formatEndpoint(endpoint)}/heartbeat`,
    method: 'GET',
  };
  // Send the request
  return Send(options);
};

module.exports = {
  heartbeat,
};
