import SockJSNode from 'sockjs-client';
import { SockJS as SockJSBrowser } from '../../external/sockjs-0.3.4';

/**
 * Check if socket is open
 *
 * @param {object} connector - A connector object
 *
 * @return {boolean} - True if open, false otherwise
 */
const checkReadyState = function (connector) {
  const self = connector;
  if (SockJSBrowser ? self.socket.readyState !== SockJSBrowser.OPEN : self.socket.readyState !== SockJSNode.OPEN) {
    return false;
  }
  return true;
};

/**
 * Subscribe to the new blocks channel
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 *
 * @return the received data in the callback
 */
const subscribeNewBlocks = function (connector, callback) {
  const self = connector;
  if (!checkReadyState(connector)) {
    return false;
  }
  self.stompClient.subscribe('/blocks', (data) => {
    callback(JSON.parse(data.body));
  });
};

/**
 * Subscribe to the new height channel
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 *
 * @return the received data in the callback
 */
const subscribeNewHeight = function (connector, callback) {
  const self = connector;
  if (!checkReadyState(connector)) {
    return false;
  }
  self.stompClient.subscribe('/blocks/new', (data) => {
    callback(JSON.parse(data.body));
  });
};

module.exports = {
  requests: {

  },
  subscribe: {
    height: subscribeNewHeight,
    blocks: subscribeNewBlocks,
  },
};
