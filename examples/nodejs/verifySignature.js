// Include the library
var nem = require("../../build/index.js").default;

// Create keypair
var kp = nem.crypto.keyPair.create("privateKey");

// Data to sign
var data = "NEM is awesome !"

// Sign data
var sig = kp.sign(data);

// Review
console.log("Public key: " + kp.publicKey.toString());
console.log("Original data: " + data);
console.log("Signature: " + sig.toString());

// Result
console.log("\nResult: ");
if(nem.crypto.verifySignature(kp.publicKey.toString(), data, sig.toString())) {
	console.log("Signature is valid");
} else {
	console.log("Signature is invalid");
}
