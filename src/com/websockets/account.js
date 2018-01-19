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
 * Request the account data of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
const requestAccountData = function (connector, address) {
  const self = connector;
  // If not ready, wait a bit more...
  if (!checkReadyState(connector)) {
    self.timeoutHandle = setTimeout(() => {
      requestData(connector, address); // eslint-disable-line
    }, 100);
  } else {
    // Use address if provided
    const _address = undefined !== address ? address.replace(/-/g, '').toUpperCase() : self.address;
    self.stompClient.send('/w/api/account/get', {}, `{'account':'${_address}'}`);
  }
};

/**
 * Request the recent transactions of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
const requestRecentTransactions = function (connector, address) {
  const self = connector;
  // If not ready, wait a bit more...
  if (!checkReadyState(connector)) {
    self.timeoutHandle = setTimeout(() => {
      requestRecentTransactions(connector, address);
    }, 100);
  } else {
    // Use address if provided
    const _address = undefined !== address ? address.replace(/-/g, '').toUpperCase() : self.address;
    self.stompClient.send('/w/api/account/transfers/all', {}, `{'account':'${_address}'}`);
  }
};

/**
 * Request the owned mosaic definitions of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
const requestMosaicDefinitions = function (connector, address) {
  const self = connector;
  // If not ready, wait a bit more...
  if (!checkReadyState(connector)) {
    self.timeoutHandle = setTimeout(() => {
      requestRecentTransactions(connector, address);
    }, 100);
  } else {
    // Use address if provided
    const _address = undefined !== address ? address.replace(/-/g, '').toUpperCase() : self.address;
    self.stompClient.send('/w/api/account/mosaic/owned/definition', {}, `{'account':'${_address}'}`);
  }
};

/**
 * Request the owned mosaics of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
const requestMosaics = function (connector, address) {
  const self = connector;
  // If not ready, wait a bit more...
  if (!checkReadyState(connector)) {
    self.timeoutHandle = setTimeout(() => {
      requestRecentTransactions(connector, address);
    }, 100);
  } else {
    // Use address if provided
    const _address = undefined !== address ? address.replace(/-/g, '').toUpperCase() : self.address;
    self.stompClient.send('/w/api/account/mosaic/owned', {}, `{'account':'${_address}'}`);
  }
};

/**
 * Request the owned namespaces of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
const requestNamespaces = function (connector, address) {
  const self = connector;
  // If not ready, wait a bit more...
  if (!checkReadyState(connector)) {
    self.timeoutHandle = setTimeout(() => {
      requestRecentTransactions(connector, address);
    }, 100);
  } else {
    // Use address if provided
    const _address = undefined !== address ? address.replace(/-/g, '').toUpperCase() : self.address;
    self.stompClient.send('/w/api/account/namespace/owned', {}, `{'account':'${_address}'}`);
  }
};

/**
 * Subscribe to the account data channel for the address in the given connector
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
const subscribeAccountData = function (connector, callback, address) {
  const self = connector;
  if (!checkReadyState(connector)) {
    return false;
  }
  // Use address if provided
  const _address = undefined !== address ? address.replace(/-/g, '').toUpperCase() : self.address;
  self.stompClient.subscribe(`/account/${_address}`, (data) => {
    callback(JSON.parse(data.body));
  });
};

/**
 * Subscribe to the recent transactions channel for the address in the given connector
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
const subscribeRecentTransactions = function (connector, callback, address) {
  const self = connector;
  if (!checkReadyState(connector)) {
    return false;
  }
  // Use address if provided
  const _address = undefined !== address ? address.replace(/-/g, '').toUpperCase() : self.address;
  self.stompClient.subscribe(`/recenttransactions/${_address}`, (data) => {
    callback(JSON.parse(data.body));
  });
};

/**
 * Subscribe to the unconfirmed transactions channel for the address in the given connector
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
const subscribeUnconfirmedTransactions = function (connector, callback, address) {
  const self = connector;
  if (!checkReadyState(connector)) {
    return false;
  }
  // Use address if provided
  const _address = undefined !== address ? address.replace(/-/g, '').toUpperCase() : self.address;
  self.stompClient.subscribe(`/unconfirmed/${_address}`, (data) => {
    callback(JSON.parse(data.body));
  });
};

/**
 * Subscribe to the confirmed transactions channel for the address in the given connector
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
const subscribeConfirmedTransactions = function (connector, callback, address) {
  const self = connector;
  if (!checkReadyState(connector)) {
    return false;
  }
  // Use address if provided
  const _address = undefined !== address ? address.replace(/-/g, '').toUpperCase() : self.address;
  self.stompClient.subscribe(`/transactions/${_address}`, (data) => {
    callback(JSON.parse(data.body));
  });
};

/**
 * Subscribe to the mosaic definitions channel for the address in the given connector
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
const subscribeMosaicDefinitions = function (connector, callback, address) {
  const self = connector;
  if (!checkReadyState(connector)) {
    return false;
  }
  // Use address if provided
  const _address = undefined !== address ? address.replace(/-/g, '').toUpperCase() : self.address;
  self.stompClient.subscribe(`/account/mosaic/owned/definition/${_address}`, (data) => {
    callback(JSON.parse(data.body));
  });
};

/**
 * Subscribe to the owned mosaics channel for the address in the given connector
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
const subscribeMosaics = function (connector, callback, address) {
  const self = connector;
  if (!checkReadyState(connector)) {
    return false;
  }
  // Use address if provided
  const _address = undefined !== address ? address.replace(/-/g, '').toUpperCase() : self.address;
  self.stompClient.subscribe(`/account/mosaic/owned/${_address}`, (data) => {
    callback(JSON.parse(data.body), _address);
  });
};

/**
 * Subscribe to the owned namespaces channel for the address in the given connector
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
const subscribeNamespaces = function (connector, callback, address) {
  const self = connector;
  if (!checkReadyState(connector)) {
    return false;
  }
  // Use address if provided
  const _address = undefined !== address ? address.replace(/-/g, '').toUpperCase() : self.address;
  self.stompClient.subscribe(`/account/namespace/owned/${_address}`, (data) => {
    callback(JSON.parse(data.body), _address);
  });
};

module.exports = {
  requests: {
    data: requestAccountData,
    transactions: {
      recent: requestRecentTransactions,
    },
    mosaics: {
      owned: requestMosaics,
      definitions: requestMosaicDefinitions,
    },
    namespaces: {
      owned: requestNamespaces,
    },
  },
  subscribe: {
    data: subscribeAccountData,
    transactions: {
      recent: subscribeRecentTransactions,
      confirmed: subscribeConfirmedTransactions,
      unconfirmed: subscribeUnconfirmedTransactions,
    },
    mosaics: {
      owned: subscribeMosaics,
      definitions: subscribeMosaicDefinitions,
    },
    namespaces: {
      owned: subscribeNamespaces,
    },
  },
};
