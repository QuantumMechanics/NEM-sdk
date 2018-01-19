import SockJSNode from 'sockjs-client';
import { SockJS as SockJSBrowser } from '../../external/sockjs-0.3.4';
import { Stomp } from '../../external/stomp';

/**
 * Tries to establish a connection.
 *
 * @return {promise} - A resolved or rejected promise
 */
const connect = function () {
  return new Promise((resolve, reject) => {
    const self = this;
    if (!SockJSBrowser) self.socket = new SockJSNode(`${self.endpoint.host}:${self.endpoint.port}/w/messages`);
    else self.socket = new SockJSBrowser(`${self.endpoint.host}:${self.endpoint.port}/w/messages`);
    self.stompClient = Stomp.over(self.socket);
    self.stompClient.debug = false;
    self.stompClient.connect({}, () => {
      resolve(true);
    }, () => {
      reject('Connection failed!');
    });
  });
};

/**
 * Close a connection
 */
const close = function () {
  const self = this;
  console.log(`Connection to ${self.endpoint.host} must be closed now.`);
  self.socket.close();
  self.socket.onclose = function (e) {
    console.log(e);
  };
};

/**
 * Create a connector object
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {object} - A connector object
 */
const create = function (endpoint, address) {
  return {
    endpoint,
    address: address.replace(/-/g, '').toUpperCase(),
    socket: undefined,
    stompClient: undefined,
    connect,
    close,
  };
};


module.exports = {
  create,
};
