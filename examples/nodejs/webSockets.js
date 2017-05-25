// Load nem-browser library
var nem = require("../../build/index.js").default;

// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.websocketPort);

// Address to subscribe
var address = "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S";

// Create a connector object
var connector = nem.com.websockets.connector.create(endpoint, address);

// Set start date of the monitor
var date = new Date();

// Show event
console.log(date.toLocaleString() +': Starting monitor...');

// Try to establish a connection
connect(connector);

// Connect using connector
function connect(connector){
    return connector.connect().then(function() {
    	// Set time
    	date = new Date();

        // If we are here, we are connected
    	console.log(date.toLocaleString()+': Connected to: '+ connector.endpoint.host);
    	
        // Show event
    	console.log( date.toLocaleString()+': Subscribing to errors');

        // Subscribe to errors channel
        nem.com.websockets.subscribe.errors(connector, function(res){
            // Set time
            date = new Date();
            // Show event
            console.log(date.toLocaleString()+': Received error');
            // Show data
            console.log(date.toLocaleString()+': ' + JSON.stringify(res));
        });

        // Show event
    	console.log(date.toLocaleString()+': Subscribing to new blocks');

        // Subscribe to new blocks channel
        nem.com.websockets.subscribe.chain.blocks(connector, function(res){
            // Set time
            date = new Date();
            // Show event
            console.log(date.toLocaleString()+': Received a new block');
            // Show data
            console.log(date.toLocaleString()+': ' + JSON.stringify(res) +'');
        });

        // Show event
    	console.log(date.toLocaleString()+': Subscribing to recent transactions');

        // Subscribe to recent transactions channel
        nem.com.websockets.subscribe.account.transactions.recent(connector, function(res){
            // Set time
            date = new Date();
            // Show event
            console.log(date.toLocaleString()+': Received recent transactions');
            // Show data
            console.log(date.toLocaleString()+': ' + JSON.stringify(res));
        });

        // Show event
    	console.log(date.toLocaleString()+': Subscribing to account data of '+ connector.address);

        // Subscribe to account data channel
        nem.com.websockets.subscribe.account.data(connector, function(res) {
            // Set time
            date = new Date();
            // Show event
            console.log(date.toLocaleString()+': Received account data');
            // Show data
            console.log(date.toLocaleString()+': ' + JSON.stringify(res));
        });

        // Show event
    	console.log(date.toLocaleString()+': Subscribing to unconfirmed transactions of '+ connector.address);

        // Subscribe to unconfirmed transactions channel
        nem.com.websockets.subscribe.account.transactions.unconfirmed(connector, function(res) {
            // Set time
            date = new Date();
            // Show event
            console.log(date.toLocaleString()+': Received unconfirmed transaction');
            // Show data
            console.log(date.toLocaleString()+': ' + JSON.stringify(res));
        });

        // Show event
    	console.log(date.toLocaleString()+': Subscribing to confirmed transactions of '+ connector.address);

        // Subscribe to confirmed transactions channel
        nem.com.websockets.subscribe.account.transactions.confirmed(connector, function(res) {
            // Set time
            date = new Date();
            // Show event
            console.log(date.toLocaleString()+': Received confirmed transaction');
            // Show data
            console.log(date.toLocaleString()+': ' + JSON.stringify(res));
        });
        
        // Show event
    	console.log(date.toLocaleString()+': Requesting account data of '+ connector.address);

        // Request account data
        nem.com.websockets.requests.account.data(connector);

        // Show event
    	console.log(date.toLocaleString()+': Requesting recent transactions of '+ connector.address);

        // Request recent transactions
        nem.com.websockets.requests.account.transactions.recent(connector);

    }, function(err) {
        // Set time
        date = new Date();
        // Show event
        console.log(date.toLocaleString()+': An error occured');
        // Show data
        console.log(date.toLocaleString()+': ' + JSON.stringify(err));
        // Try to reconnect
        reconnect();
    });
}

function reconnect() {
    // Replace endpoint object
    endpoint = nem.model.objects.create("endpoint")("http://bob.nem.ninja", 7778);
    // Replace connector
    connector = nem.com.websockets.connector.create(endpoint, address);
    // Set time
    date = new Date();
    // Show event
    console.log(date.toLocaleString()+': Trying to connect to: '+ endpoint.host);
    // Try to establish a connection
    connect(connector);
}