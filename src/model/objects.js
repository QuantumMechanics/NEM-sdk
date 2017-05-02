import Network from './network';

let endpoint = function(host, port) {
    return {
        "host": host || "",
        "port": port || ""
    }
};

let common = function(password, privateKey) {
	return {
        "password": password || "",
	    "privateKey": privateKey || ""
    }
};

let mosaicAttachment = function(namespaceId, mosaicName, quantity) {
    return {
        "mosaicId": {
        	"namespaceId": namespaceId || "",
        	"name": mosaicName || ""
        },
        "quantity": quantity || 0
    }
};

let mosaicDefinitionMetaDataPair = function() {
    return {
        "nem:xem": {
            "mosaicDefinition" : {
                "creator": "3e82e1c1e4a75adaa3cba8c101c3cd31d9817a2eb966eb3b511fb2ed45b8e262",
                "description": "reserved xem mosaic",
                "id": {
                    "namespaceId": "nem",
                    "name": "xem"
                },
                "properties": [{
                    "name": "divisibility",
                    "value": "6"
                }, {
                    "name": "initialSupply",
                    "value": "8999999999"
                }, {
                    "name": "supplyMutable",
                    "value": "false"
                }, {
                    "name": "transferable",
                    "value": "true"
                }],
                "levy": {}
            }
        }/*,
        "another.namespace:mosaic": {
            "mosaicDefinition": {
                Add mosaic definitions in this model to simplify transactions for a particular mosaic
            }
        } ,
        "another.namespace.again:mosaic": {
            "mosaicDefinition": {
                ...
            }
        } */
    }
}

let invoice = function() {
    return  {
        "v": "v = 1 for testnet, v = 2 for mainnet",
        "type": 2,
        "data": {
            "addr": "",
            "amount": 0,
            "msg": "",
            "name": ""
        }
    }
}

/**
 * An un-prepared transfer transaction object
 *
 * @return {object}
 */
let transferTransaction = function(recipient, amount, message) {
    return {
        "amount": amount || 0,
        "recipient": recipient || "",
        "recipientPublicKey": "",
        "isMultisig": false,
        "multisigAccount" : "",
        "message": message || "",
        "isEncrypted" : false,
        "mosaics": []
    }
}

let signatureTransaction = {}

let multisignatureModificationTransaction = {}

let mosaicDefinitionTransaction = {}

let namespaceProvisionTransaction = {}

let importanceTransferTransaction = {}

/**
 * Get an empty object 
 *
 * @param {string} objectName - The name of the object
 *
 * @retrun {object} - The desired object
 */
let get = function(objectName) {
    switch(objectName) {
        case "common":
            return common();
            break;
        case "endpoint":
            return endpoint();
            break;
        case "mosaicAttachment":
            return mosaicAttachment();
            break;
        case "mosaicDefinitionMetaDataPair":
            return mosaicDefinitionMetaDataPair();
            break;
        case "invoice":
            return invoice();
            break;
        case "transferTransaction":
            return transferTransaction();
            break;
        default:
            return {};
    } 
}

/**
 * Get function creating objects
 *
 * @param {string} objectName - The name of the object
 *
 * @retrun {function} - The object creation function corresponding to the object name
 */
let create = function(objectName) {
    switch(objectName) {
        case "common":
            return common;
            break;
        case "endpoint":
            return endpoint;
            break;
        case "mosaicAttachment":
            return mosaicAttachment;
            break;
        case "invoice":
            return invoice;
            break;
        case "transferTransaction":
            return transferTransaction;
            break;
        default:
            return {};
    } 
}

module.exports = {
    get,
    create
}