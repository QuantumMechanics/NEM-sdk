import { SockJS as SockJSBrowser } from '../../external/sockjs-0.3.4';
import SockJSNode from 'sockjs-client';

/**
 * Check if socket is open
 *
 * @param {object} connector - A connector object
 *
 * @return {boolean} - True if open, false otherwise
 */
let checkReadyState = function(connector) {
    var self = connector;
    if (SockJSBrowser ? self.socket.readyState !== SockJSBrowser.OPEN : self.socket.readyState !== SockJSNode.OPEN) {
        return false;
    } 
    return true;
}

/**
 * Request the account data of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
let requestAccountData = function(connector, address) {
    var self = connector;
    // If not ready, wait a bit more...
    if (!checkReadyState(connector)) {
        self.timeoutHandle = setTimeout(function() {
            requestAccountData(connector, address);
        }, 100);
    } else {
        // Use address if provided
        let _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
        self.stompClient.send("/w/api/account/get", {}, "{'account':'" + _address + "'}");
    }
}

/**
 * Request the recent transactions of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
let requestRecentTransactions = function(connector, address) {
	 var self = connector;
    // If not ready, wait a bit more...
    if (!checkReadyState(connector)) {
        self.timeoutHandle = setTimeout(function() {
            requestRecentTransactions(connector, address);
        }, 100);
    } else {
        // Use address if provided
        let _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
        self.stompClient.send("/w/api/account/transfers/all", {}, "{'account':'" + _address + "'}");
    }
}

/**
 * Request the owned mosaic definitions of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
let requestMosaicDefinitions = function(connector, address) {
     var self = connector;
    // If not ready, wait a bit more...
    if (!checkReadyState(connector)) {
        self.timeoutHandle = setTimeout(function() {
            requestMosaicDefinitions(connector, address);
        }, 100);
    } else {
        // Use address if provided
        let _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
        self.stompClient.send("/w/api/account/mosaic/owned/definition", {}, "{'account':'" + _address + "'}");
    }
}

/**
 * Request the owned mosaics of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
let requestMosaics = function(connector, address) {
     var self = connector;
    // If not ready, wait a bit more...
    if (!checkReadyState(connector)) {
        self.timeoutHandle = setTimeout(function() {
            requestMosaics(connector, address);
        }, 100);
    } else {
        // Use address if provided
        let _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
        self.stompClient.send("/w/api/account/mosaic/owned", {}, "{'account':'" + _address + "'}");
    }
}

/**
 * Request the owned namespaces of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
let requestNamespaces = function(connector, address) {
     var self = connector;
    // If not ready, wait a bit more...
    if (!checkReadyState(connector)) {
        self.timeoutHandle = setTimeout(function() {
            requestNamespaces(connector, address);
        }, 100);
    } else {
        // Use address if provided
        let _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
        self.stompClient.send("/w/api/account/namespace/owned", {}, "{'account':'" + _address + "'}");
    }
}

/**
 * Subscribe to the account data channel for the address in the given connector 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
let subscribeAccountData = function(connector, callback, address) {
	var self = connector;
	if (!checkReadyState(connector)) {
        return false;
    }
    // Use address if provided
    let _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
	self.stompClient.subscribe('/account/' + _address, function(data) {
        callback(JSON.parse(data.body));
    });
}

/**
 * Subscribe to the recent transactions channel for the address in the given connector 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
let subscribeRecentTransactions = function(connector, callback, address) {
	var self = connector;
	if (!checkReadyState(connector)) {
        return false;
    }
    // Use address if provided
    let _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
	self.stompClient.subscribe('/recenttransactions/' + _address, function(data) {
        callback(JSON.parse(data.body));
    }); 
}

/**
 * Subscribe to the unconfirmed transactions channel for the address in the given connector 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
let subscribeUnconfirmedTransactions = function(connector, callback, address) {
    var self = connector;
    if (!checkReadyState(connector)) {
        return false;
    }
    // Use address if provided
    let _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
    self.stompClient.subscribe('/unconfirmed/' + _address, function(data) {
        callback(JSON.parse(data.body));
    });
}

/**
 * Subscribe to the confirmed transactions channel for the address in the given connector 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
let subscribeConfirmedTransactions = function(connector, callback, address) {
    var self = connector;
    if (!checkReadyState(connector)) {
        return false;
    }
    // Use address if provided
    let _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
    self.stompClient.subscribe('/transactions/' + _address, function(data) {
        callback(JSON.parse(data.body));
    });
}

/**
 * Subscribe to the mosaic definitions channel for the address in the given connector 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
let subscribeMosaicDefinitions = function(connector, callback, address) {
    var self = connector;
    if (!checkReadyState(connector)) {
        return false;
    }
    // Use address if provided
    let _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
    self.stompClient.subscribe('/account/mosaic/owned/definition/' + _address, function(data) {
        callback(JSON.parse(data.body));
    });
}

/**
 * Subscribe to the owned mosaics channel for the address in the given connector 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
let subscribeMosaics = function(connector, callback, address) {
    var self = connector;
    if (!checkReadyState(connector)) {
        return false;
    }
    // Use address if provided
    let _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
    self.stompClient.subscribe('/account/mosaic/owned/' + _address, function(data) {
        callback(JSON.parse(data.body), _address);
    });
}

/**
 * Subscribe to the owned namespaces channel for the address in the given connector 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
let subscribeNamespaces = function(connector, callback, address) {
    var self = connector;
    if (!checkReadyState(connector)) {
        return false;
    }
    // Use address if provided
    let _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
    self.stompClient.subscribe('/account/namespace/owned/' + _address, function(data) {
        callback(JSON.parse(data.body), _address);
    });
}

module.exports = {
	requests: {
		data: requestAccountData,
		transactions: {
			recent: requestRecentTransactions
		},
        mosaics: {
            owned: requestMosaics,
            definitions: requestMosaicDefinitions
        },
        namespaces: {
            owned: requestNamespaces
        }
	},
	subscribe: {
		data: subscribeAccountData,
		transactions: {
			recent: subscribeRecentTransactions,
            confirmed: subscribeConfirmedTransactions,
			unconfirmed: subscribeUnconfirmedTransactions
		},
        mosaics: {
            owned: subscribeMosaics,
            definitions: subscribeMosaicDefinitions
        },
        namespaces: {
            owned: subscribeNamespaces
        } 
	}
}