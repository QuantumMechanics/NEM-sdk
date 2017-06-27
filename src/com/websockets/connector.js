import { SockJS as SockJSBrowser } from '../../external/sockjs-0.3.4';
import SockJSNode from 'sockjs-client';
import { Stomp } from '../../external/stomp';

/**
 * Create a connector object
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {object} - A connector object
 */
let create = function(endpoint, address) {
	return {
		endpoint: endpoint,
		address: address.replace(/-/g, "").toUpperCase(),
		socket: undefined,
        stompClient: undefined,
        timeoutReconnect: undefined,
        connectionAttempts: 0,
        connect: connect,
        close: close
	}
}

/**
 * Tries to establish a connection. 
 * After 10 failed attempts the promise will reject
 *
 * @return {promise} - A resolved or rejected promise
 */
let connect = function() {
	return new Promise((resolve, reject) => {
		var self = this;
		if(!SockJSBrowser) {
			self.socket = new SockJSNode(self.endpoint.host + ':' + self.endpoint.port + '/w/messages');
		} else {
			self.socket = new SockJSBrowser(self.endpoint.host + ':' + self.endpoint.port + '/w/messages');
		}
	    self.stompClient = Stomp.over(self.socket);
	    self.stompClient.debug = false;
	    // Timeout fix in case NIS socket is not responding
	    let timeoutFix = setTimeout(() => {
	    	reject("Not responding after 10 seconds!");
	    }, 10000);
	    self.stompClient.connect({}, function(frame) {
	    	// Clear the timeout fix
	    	clearTimeout(timeoutFix);
		    resolve(true);
	    }, (err) => {
	    	// Clear the timeout fix
	    	clearTimeout(timeoutFix);
	    	// Add one attempt
	    	self.connectionAttempts++;
	        // Try to reconnect
	        self.timeoutReconnect = setTimeout(() => {
	        	if(self.connectionAttempts > 9) {
	        		// Reset connection attempts
	        		self.connectionAttempts = 0;
	        		// Reject
	        		reject("10 connection attempts failed!");
	        	} else {
			        console.log("Trying to reconnect...");
			        // Tries to connect again
			        resolve(self.connect());
		    	}
		    }, 1000);
		});
	});
}

/**
 * Close a connection
 */
let close = function() {
    var self = this;
    console.log("Connection to "+ self.endpoint.host +" must be closed now.");
    // Stop trying to reconnect
    clearTimeout(self.timeoutReconnect);
    self.socket.close();
    self.socket.onclose = function(e) {
        console.log(e);
    };
}

module.exports = {
	create
}