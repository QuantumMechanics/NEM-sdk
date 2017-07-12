/**
 * An un-prepared transfer transaction object
 *
 * @param {string} recipient - A NEM account address
 * @param {number} amount - A number of XEM
 * @param {string} message - A message
 *
 * @return {object}
 */
let transfer = function(recipient, amount, message) {
    return {
        "amount": amount || 0,
        "recipient": recipient || "",
        "recipientPublicKey": "",
        "isMultisig": false,
        "multisigAccount" : "",
        "message": message || "",
        "messageType" : 1,
        "mosaics": []
    }
}

/**
 * An un-prepared signature transaction object
 *
 * @param  {string} multisigAccount - The multisig account address
 * @param  {string} txHash - The multisig transaction hash
 *
 * @return {object}
 */
let signature = function(multisigAccount, txHash) {
    let compressedAccount = "";
    if (typeof multisigAccount != "undefined" && multisigAccount.length) {
        compressedAccount = multisigAccount.toUpperCase().replace(/-/g, "");
    }

    return {
        "otherHash": {
            "data": txHash || ""
        },
        "otherAccount": compressedAccount
    }
}

/**
 * An un-prepared mosaic definition transaction object
 *
 * @return {object}
 */
let mosaicDefinition = function() {
    return {
        "mosaicName": "",
        "namespaceParent": "",
        "mosaicDescription": "",
        "properties": {
            "initialSupply": 0,
            "divisibility": 0,
            "transferable": true,
            "supplyMutable": true
        },
        "levy": {
            "mosaic": null,
            "address": "",
            "feeType": 1,
            "fee": 5
        },
        "isMultisig": false,
        "multisigAccount" : ""
    }
}

/**
 * An un-prepared mosaic supply change transaction object
 *
 * @return {object}
 */
let mosaicSupplyChange = function() {
    return {
        "mosaic": "",
        "supplyType": 1,
        "delta": 0,
        "isMultisig": false,
        "multisigAccount" : ""
    }
}

/**
 * An un-prepared multisig aggregate modification transaction object
 *
 * @return {object}
 */
let multisigAggregateModification = function() {
    return {
        "modifications": [],
        "relativeChange": null,
        "isMultisig": false,
        "multisigAccount" : ""
    }
}

/**
 * An un-prepared namespace provision transaction object
 *
 * @param {string} namespaceName - A namespace name
 * @param {string} namespaceParent - A namespace name
 *
 * @return {object}
 */
let namespaceProvision = function(namespaceName, namespaceParent) {
    return {
        "namespaceName": namespaceName || "",
        "namespaceParent": namespaceParent || null,
        "isMultisig": false,
        "multisigAccount" : ""
    }
}

/**
 * The common part of transactions
 *
 * @param {number} txType - A type of transaction
 * @param {string} senderPublicKey - A sender public key
 * @param {number} timeStamp - A timestamp for the transation
 * @param {number} due - A deadline in minutes
 * @param {number} version - A network version
 * @param {number} network - A network id
 *
 * @return {object} - A common transaction object
 */
let commonPart = function(txtype, senderPublicKey, timeStamp, due, version, network) {
    return {
        'type': txtype || "",
        'version': version || "",
        'signer': senderPublicKey || "",
        'timeStamp': timeStamp || "",
        'deadline': timeStamp + due * 60 || ""
    };
}

module.exports = {
    multisigAggregateModification,
    transfer,
    signature,
    mosaicDefinition,
    mosaicSupplyChange,
    namespaceProvision,
    commonPart
}