// Load nem-browser library
var nem = require("nem-sdk").default;

// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.websocketPort);

// Address to subscribe
var address = "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S";

// Create a connector object
var connector = nem.com.websockets.connector.create(endpoint, address);

// Set start date of the monitor
var date = new Date();

// Add event to the stream div
$('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Starting monitor...</p>');

// Try to establish a connection
connect(connector);

// Connect using connector
function connect(connector){
    return connector.connect().then(function() {
    	// Set time
    	date = new Date();

        // If we are here, we are connected
    	$('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Connected to: '+ connector.endpoint.host +'</p>');
    	
        // Show event
    	$('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Subscribing to errors</p>');

        // Subscribe to errors channel
        nem.com.websockets.subscribe.errors(connector, function(res){
            // Set time
            date = new Date();
            // Show event
            $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Received error</p>');
            // Show data
            $('#stream').append('<p><b>'+ date.toLocaleString()+': <pre>' + JSON.stringify(res) +'</pre>');
        });

        // Show event
    	$('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Subscribing to new blocks</p>');

        // Subscribe to new blocks channel
        nem.com.websockets.subscribe.chain.blocks(connector, function(res){
            // Set time
            date = new Date();
            // Show event
            $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Received a new block</p>');
            // Show data
            $('#stream').append('<p><b>'+ date.toLocaleString()+': <pre>' + JSON.stringify(res) +'</pre>');
        });

        // Show event
    	$('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Subscribing to recent transactions</p>');

        // Subscribe to recent transactions channel
        nem.com.websockets.subscribe.account.transactions.recent(connector, function(res){
            // Set time
            date = new Date();
            // Show event
            $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Received recent transactions</p>');
            // Show data
            $('#stream').append('<p><b>'+ date.toLocaleString()+': <pre>' + JSON.stringify(res) +'</pre>');
        });

        // Show event
    	$('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Subscribing to account data of '+ connector.address +'</p>');

        // Subscribe to account data channel
        nem.com.websockets.subscribe.account.data(connector, function(res) {
            // Set time
            date = new Date();
            // Show event
            $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Received account data</p>');
            // Show data
            $('#stream').append('<p><b>'+ date.toLocaleString()+': <pre>' + JSON.stringify(res) +'</pre>');
        });

        // Show event
    	$('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Subscribing to unconfirmed transactions of '+ connector.address +'</p>');

        // Subscribe to unconfirmed transactions channel
        nem.com.websockets.subscribe.account.transactions.unconfirmed(connector, function(res) {
            // Set time
            date = new Date();
            // Show event
            $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Received unconfirmed transaction</p>');
            // Show data
            $('#stream').append('<p><b>'+ date.toLocaleString()+': <pre>' + JSON.stringify(res) +'</pre>');
        });

        // Show event
    	$('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Subscribing to confirmed transactions of '+ connector.address +'</p>');

        // Subscribe to confirmed transactions channel
        nem.com.websockets.subscribe.account.transactions.confirmed(connector, function(res) {
            // Set time
            date = new Date();
            // Show event
            $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Received confirmed transaction</p>');
            // Show data
            $('#stream').append('<p><b>'+ date.toLocaleString()+': <pre>' + JSON.stringify(res) +'</pre>');
        });
        
        // Show event
    	$('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Requesting account data of '+ connector.address +'</p>');

        // Request account data
        nem.com.websockets.requests.account.data(connector);

        // Show event
    	$('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Requesting recent transactions of '+ connector.address +'</p>');
        
        // Request recent transactions
        nem.com.websockets.requests.account.transactions.recent(connector);

    }, function(err) {
        // Set time
        date = new Date();
        // Show event
        $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> An error occured</p>');
        // Show data
        $('#stream').append('<p><b>'+ date.toLocaleString()+': <pre>' + JSON.stringify(err) +'</pre>');
        // Try to reconnect
        reconnect();
    });
}

function reconnect() {
    // Replace endpoint object
    endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.testnet[1].uri, nem.model.nodes.websocketPort);
    // Replace connector
    connector = nem.com.websockets.connector.create(endpoint, address);
    // Set time
    date = new Date();
    // Show event
    $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Trying to connect to: '+ endpoint.host +'</p>');
    // Try to establish a connection
    connect(connector);
}