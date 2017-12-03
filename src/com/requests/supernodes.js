import Send from './send';
import Nodes from '../../model/nodes';

/**
 * Gets all nodes of the node reward program
 *
 * @return {array} - An array of SuperNodeInfo objects
 */
let all = function(){
	// Configure the request
	var options = {
	    url: Nodes.supernodes,
	    method: 'GET'
	}
	// Send the request
	return Send(options);
};

/**
 * Gets the nearest supernodes
 *
 * @param {object} coords - A coordinates object: https://www.w3schools.com/html/html5_geolocation.asp
 *
 * @return {array} - An array of supernodeInfo objects
 */
let nearest = function(coords) {
    let obj = {
       "latitude": coords.latitude,
       "longitude": coords.longitude,
       "numNodes": 5
    }
    // Configure the request
	var options = {
	    url: 'http://199.217.113.179:7782/nodes/nearest',
	    method: 'POST',
	    json: true,
	    body: obj
	}
	// Send the request
	return Send(options);
}

/**
 * Gets the all supernodes by status
 *
 * @param {number} status - 0 for all nodes, 1 for active nodes, 2 for inactive nodes
 *
 * @return {array} - An array of supernodeInfo objects
 */
let get = function(status) {
    let obj = {
        "status": undefined === status ? 1 : status
    }
    // Configure the request
	var options = {
	    url: 'http://199.217.113.179:7782/nodes',
	    method: 'POST',
	    json: true,
	    body: obj
	}
	// Send the request
	return Send(options);
}

module.exports = {
	all,
	nearest,
	get
}