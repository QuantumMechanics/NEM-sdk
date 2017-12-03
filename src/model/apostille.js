import CryptoJS from 'crypto-js';
import Helpers from '../utils/helpers';
import Convert from '../utils/convert';
import KeyPair from '../crypto/keyPair';
import Address from '../model/address';
import Sinks from '../model/sinks';
import modelObjects from '../model/objects';
import Transactions from '../model/transactions';

/**
 * Apostille hashing methods with version bytes
 *
 * @type {object}
 */
const hashing = {
	"MD5": {
	    name: "MD5",
	    signedVersion: "81",
	    version: "01"
	},
	"SHA1": {
	    name: "SHA1",
	    signedVersion: "82",
	    version: "02"
	},
	"SHA256" : {
	    name: "SHA256",
	    signedVersion: "83",
	    version: "03"
	},
	"SHA3-256": {
	    name: "SHA3-256",
	    signedVersion: "88",
	    version: "08"
	},
	"SHA3-512": {
	    name: "SHA3-512",
	    signedVersion: "89",
	    version: "09"
	}
}

/**
 * Hash the file content depending of hashing
 *
 * @param {wordArray} data - File content
 * @param {object} hashing - The chosen hashing object
 * @param {boolean} isPrivate - True if apostille is private, false otherwise
 *
 * @return {string} - The file hash with checksum
 */
let hashFileData = function(data, hashing, isPrivate) {
    // Full checksum is 0xFE (added automatically if hex txes) + 0x4E + 0x54 + 0x59 + hashing version byte
    let checksum;
    // Append byte to checksum
    if (isPrivate) {
        checksum = "4e5459" + hashing.signedVersion;
    } else {
        checksum = "4e5459" + hashing.version;
    }
    // Build the apostille hash
    if (hashing.name === "MD5") {
        return checksum + CryptoJS.MD5(data);
    } else if (hashing.name === "SHA1") {
        return checksum + CryptoJS.SHA1(data);
    } else if (hashing.name === "SHA256") {
        return checksum + CryptoJS.SHA256(data);
    } else if (hashing.name === "SHA3-256") {
        return checksum + CryptoJS.SHA3(data, {
            outputLength: 256
        });
    } else {
        return checksum + CryptoJS.SHA3(data, {
            outputLength: 512
        });
    }
};

/**
 * Create an apostille object
 *
 * @param {object} common - A common object
 * @param {string} fileName - The file name (with extension)
 * @param {wordArray} fileContent - The file content
 * @param {string} tags - The apostille tags
 * @param {object} hashing - An hashing object
 * @param {boolean} isMultisig - True if transaction is multisig, false otherwise
 * @param {object} multisigAccount - An [AccountInfo]{@link https://bob.nem.ninja/docs/#accountInfo} object
 * @param {boolean} isPrivate - True if apostille is private / transferable / updateable, false if public
 * @param {number} network - A network id
 *
 * @return {object} - An apostille object containing apostille data and the prepared transaction ready to be sent
 */
let create = function(common, fileName, fileContent, tags, hashing, isMultisig, multisigAccount, isPrivate, network) {
	let dedicatedAccount = {};
	let apostilleHash;
	//
	if (isPrivate) {
        // Create user keypair
        let kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
        // Create the dedicated account
        dedicatedAccount = generateAccount(common, fileName, network);
        // Create hash from file content and selected hashing
        let hash = hashFileData(fileContent, hashing, isPrivate);
        // Get checksum
        let checksum = hash.substring(0, 8);
        // Get hash without checksum
        let dataHash = hash.substring(8);
        // Set checksum + signed hash as message
        apostilleHash = checksum + kp.sign(dataHash).toString();
    } else {
        // Use sink account
        dedicatedAccount.address = Sinks.apostille[network].toUpperCase().replace(/-/g, '');
        // Set recipient private key
        dedicatedAccount.privateKey = "None (public sink)";
        // No signing we just put the hash in message
        apostilleHash = hashFileData(fileContent, hashing, isPrivate);
	}

	// Create transfer transaction object
	let transaction = modelObjects.create("transferTransaction")(dedicatedAccount.address, 0, apostilleHash);
    // Multisig
    transaction.isMultisig = isMultisig;
    transaction.multisigAccount = multisigAccount;
    // Set message type to hexadecimal
    transaction.messageType = 0;
	// Prepare the transfer transaction object
	let transactionEntity = Transactions.prepare("transferTransaction")(common, transaction, network);

	return {
		"data": {
			"file": {
				"name": fileName,
				"hash": apostilleHash.substring(8),
				"content": fileContent
			},
			"hash": "fe" + apostilleHash,
			"checksum": "fe" + apostilleHash.substring(0, 8),
			"dedicatedAccount": {
				"address": dedicatedAccount.address,
				"privateKey": dedicatedAccount.privateKey
			},
			"tags": tags
		},
		"transaction": transactionEntity
	}
}

/**
 * Verify an apostille
 *
 * @param {wordArray} fileContent - The file content
 * @param {object} apostilleTransaction - The transaction object for the apostille
 *
 * @return {boolean} - True if valid, false otherwise
 */
let verify = function(fileContent, apostilleTransaction) {
    let apostilleHash;
    if(apostilleTransaction.type === 4100) {
        apostilleHash = apostilleTransaction.otherTrans.message.payload;
    } else {
        apostilleHash = apostilleTransaction.message.payload;
    }
	// Get the checksum
	let checksum = apostilleHash.substring(0, 10);
	// Get the hashing byte
	let hashingByte = checksum.substring(8);
	// Retrieve the hashing method using the checksum in message and hash the file accordingly
	let fileHash = retrieveHash(apostilleHash, fileContent);
	// Check if apostille is signed
	if(isSigned(hashingByte)) {
		// Verify signature
		return KeyPair.verifySignature(apostilleTransaction.signer, fileHash, apostilleHash.substring(10));
	} else {
		// Check if hashed file match hash in transaction (without checksum)
		return fileHash === apostilleHash.substring(10);
	}
}


/**
 * Hash a file according to version byte in checksum
 *
 * @param {string} apostilleHash - The hash contained in the apostille transaction
 * @param {wordArray} fileContent - The file content
 *
 * @return {string} - The file content hashed with correct hashing method
 */
let retrieveHash = function(apostilleHash, fileContent) {
	// Get checksum
	let checksum = apostilleHash.substring(0, 10)
    // Get the version byte
    let hashingVersionBytes = checksum.substring(8);
    // Hash depending of version byte
    if (hashingVersionBytes === "01" || hashingVersionBytes === "81") {
        return CryptoJS.MD5(fileContent).toString(CryptoJS.enc.Hex);
    } else if (hashingVersionBytes === "02" || hashingVersionBytes === "82") {
        return CryptoJS.SHA1(fileContent).toString(CryptoJS.enc.Hex);
    } else if (hashingVersionBytes === "03" || hashingVersionBytes === "83") {
		return CryptoJS.SHA256(fileContent).toString(CryptoJS.enc.Hex);
    } else if (hashingVersionBytes === "08" || hashingVersionBytes === "88") {
        return CryptoJS.SHA3(fileContent, { outputLength: 256 }).toString(CryptoJS.enc.Hex);
    } else {
        return CryptoJS.SHA3(fileContent, { outputLength: 512 }).toString(CryptoJS.enc.Hex);
    }
}

/**
 * Check if an apostille is signed
 *
 * @param {string} hashingByte - An hashing version byte
 *
 * @return {boolean} - True if signed, false otherwise
 */
let isSigned = function(hashingByte) {
	let array = Object.keys(hashing);
    for (let i = 0; array.length > i; i++) {
        if (hashing[array[i]].signedVersion === hashingByte) {
            return true;
        }
    }
    return false;
};

/**
 * Generate the dedicated account for a file. It will always generate the same private key for a given file name and private key
 *
 * @param {object} common - A common object
 * @param {string} fileName - The file name (with extension)
 * @param {number} network - A network id
 *
 * @return {object} - An object containing address and private key of the dedicated account
 */
let generateAccount = function(common, fileName, network) {
	// Create user keypair
	let kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
    // Create recipient account from signed sha256 hash of new filename
    let signedFilename = kp.sign(CryptoJS.SHA256(fileName).toString(CryptoJS.enc.Hex)).toString();
    // Truncate signed file name to get a 32 bytes private key
    let dedicatedAccountPrivateKey = Helpers.fixPrivateKey(signedFilename);
    // Create dedicated account key pair
    let dedicatedAccountKeyPair = KeyPair.create(dedicatedAccountPrivateKey);
    return {
    	"address":  Address.toAddress(dedicatedAccountKeyPair.publicKey.toString(), network),
    	"privateKey": dedicatedAccountPrivateKey
    }
}

module.exports = {
    create,
    generateAccount,
    hashing,
    verify,
    isSigned
}
