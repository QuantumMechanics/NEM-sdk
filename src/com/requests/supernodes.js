import Send from './send';
import Nodes from '../../model/nodes';

/**
 * Gets all nodes of the node reward program
 *
 * @return {array} - An array of SuperNodeData objects
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

module.exports = {
	all
}