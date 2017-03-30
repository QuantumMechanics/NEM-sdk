// Load nem-browser library
var nem = require("nem-sdk").default;

// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultMainnet, nem.model.nodes.defaultPort);

// Set start date of the monitor
var startDate = new Date();

// Add event to the stream div
$('#stream').append('<p><b>'+ startDate.toLocaleString()+':</b> Starting monitor...</p>');

// For ease we store transactions in an object of objects, so we can use height as a key to find data
var transactions = {};

// Init last height
var lastHeight = 0;

// Check the chain every 10 seconds, we use a hacked setInterval to fire the function and not wait for 10 seconds the first time
setInterval(function loop() {
	// Query the chain using a nem.com.requests promise
	nem.com.requests.chain.lastBlock(endpoint).then(function(res) {
		// If response height is above the last height
		if(res.height > lastHeight) {
			// Set date of event
			var date = new Date();
			// Add event to the stream div
			$('#stream').prepend('<p><b>'+ date.toLocaleString()+':</b> New block found, height: ' + res.height +'</p>');
			// Update last height
			lastHeight = res.height;
			// If block has transactions
			if(res.transactions.length) {
				// Add event to the stream div
				$('#stream').prepend('<p><b>'+ date.toLocaleString()+':</b> This block contains transactions: <a onClick="showTransactions('+ res.height +')">See</a></p>');
				// Store block transactions
				transactions[res.height] = res.transactions;
			} else {
				// Add event to the stream div
				$('#stream').prepend('<p><b>'+ date.toLocaleString()+':</b> This block is empty</p>');
			}
		} else {
			// Set date of event
			var date = new Date();
			// Add event to the stream div
			$('#stream').prepend('<p><b>'+ date.toLocaleString()+':</b> No activity during the last 10 seconds</p>');
		}
	}, function(err) {
		// Set date of event
		var date = new Date();
		// Add event to the stream div
		$('#stream').prepend('<p><b>'+ date.toLocaleString()+':</b> '+ err.toString() +'</p>');
	});
	return loop;
}(), 10000)

/**
 * Function to open modal and set transaction data into it
 */
function showTransactions(height) {
	// Set the block height in modal title
	$('#txsHeight').html(height);
	// Get the transactions for that block
	var txs = transactions[height];
	// Reset the modal body
	$('#txs').html('');
	// Loop transactions
	for(var i = 0; i < txs.length; i++) {
		// Add stringified transaction object to the modal body
		$('#txs').append('<pre>'+JSON.stringify(txs[i])+'</pre>');
    }
    // Open modal
	$('#myModal').modal('show');
}