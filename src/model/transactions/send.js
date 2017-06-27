import Helpers from '../../utils/helpers';
import Convert from '../../utils/convert';
import Serialization from '../../utils/serialization';
import KeyPair from '../../crypto/keyPair';
import Requests from '../../com/requests';

/**
 * Serialize a transaction and broadcast it to the network
 *
 * @param {object} common - A common object
 * @param {object} entity - A prepared transaction object
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {promise} - An announce transaction promise of the com.requests service
 */
let send = function(common, entity, endpoint) {
    if(!endpoint || !entity || !common) throw new Error('Missing parameter !');
    if (common.privateKey.length !== 64 && common.privateKey.length !== 66) throw new Error('Invalid private key, length must be 64 or 66 characters !');
    if (!Helpers.isHexadecimal(common.privateKey)) throw new Error('Private key must be hexadecimal only !');
    let kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
    let result = Serialization.serializeTransaction(entity);
    let signature = kp.sign(result);
    let obj = {
        'data': Convert.ua2hex(result),
        'signature': signature.toString()
    };
    return Requests.transaction.announce(endpoint, JSON.stringify(obj));
}

export default send;