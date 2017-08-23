import CryptoHelpers from '../../crypto/cryptoHelpers';
import Convert from '../../utils/convert';
import Helpers from '../../utils/helpers';

/**
 * Prepare a message object
 *
 * @param {object} common - A common object
 * @param {object} tx - An un-prepared transferTransaction object
 *
 * @return {object} - A prepared message object
 */
let prepare = function(common, tx) {
    if (tx.messageType === 2 && common.privateKey) {
        return {
            'type': 2,
            'payload': CryptoHelpers.encode(common.privateKey, tx.recipientPublicKey, tx.message.toString())
        };
    } else if (tx.messageType === 2 && common.isHW) {
        return {
            'type': 2,
            'payload': Convert.utf8ToHex(tx.message.toString()),
            'publicKey': tx.recipientPublicKey
        };
    } else if(tx.messageType === 0 && Helpers.isHexadecimal(tx.message.toString())) {
        return {
            'type': 1,
            'payload': 'fe' + tx.message.toString()
        };
    } else {
        return {
            'type': 1,
            'payload': Convert.utf8ToHex(tx.message.toString())
        };
    }
}

module.exports = {
    prepare
}