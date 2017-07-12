import Network from '../network';
import Helpers from '../../utils/helpers';
import TransactionTypes from '../transactionTypes';
import Fees from '../fees';
import KeyPair from '../../crypto/keyPair';
import Objects from '../objects';
import Sinks from '../sinks';
import MultisigWrapper from './multisigWrapper';

/**
 * Prepare a mosaic definition transaction
 *
 * @param {object} common - A common object
 * @param {object} tx - An un-prepared mosaicDefinitionTransaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [MosaicDefinitionCreationTransaction]{@link http://bob.nem.ninja/docs/#mosaicDefinitionCreationTransaction} object ready for serialization
 */
let prepare = function(common, tx, network){
    let kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
    let actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
    let rentalFeeSink = Sinks.mosaic[network].toUpperCase().replace(/-/g, '');
    let rentalFee = Fees.mosaicDefinitionTransaction;
    let namespaceParent = tx.namespaceParent.fqn;
    let mosaicName = tx.mosaicName.toString();
    let mosaicDescription = tx.mosaicDescription.toString();
    let mosaicProperties = tx.properties;
    let levy = tx.levy.mosaic ? tx.levy : null;
    let due = network === Network.data.testnet.id ? 60 : 24 * 60;
    let entity = _construct(actualSender, rentalFeeSink, rentalFee, namespaceParent, mosaicName, mosaicDescription, mosaicProperties, levy, due, network);
    if (tx.isMultisig) {
        entity = MultisigWrapper(kp.publicKey.toString(), entity, due, network);
    }
    return entity;
}

/***
 * Create a mosaic definition transaction object
 *
 * @param {string} senderPublicKey - The sender account public key
 * @param {string} rentalFeeSink - The rental sink account
 * @param {number} rentalFee - The rental fee
 * @param {string} namespaceParent - The parent namespace
 * @param {string} mosaicName - The mosaic name
 * @param {string} mosaicDescription - The mosaic description
 * @param {object} mosaicProperties - The mosaic properties object
 * @param {object} levy - The levy object
 * @param {number} due - The deadline in minutes
 * @param {number} network - A network id
 *
 * @return {object} - A [MosaicDefinitionCreationTransaction]{@link http://bob.nem.ninja/docs/#mosaicDefinitionCreationTransaction} object
 */
let _construct = function(senderPublicKey, rentalFeeSink, rentalFee, namespaceParent, mosaicName, mosaicDescription, mosaicProperties, levy, due, network) {
    let timeStamp = Helpers.createNEMTimeStamp();
    let version = Network.getVersion(1, network);
    let data = Objects.create("commonTransactionPart")(TransactionTypes.mosaicDefinition, senderPublicKey, timeStamp, due, version);
    let fee = Fees.namespaceAndMosaicCommon;
    let levyData = levy ? {
        'type': levy.feeType,
        'recipient': levy.address.toUpperCase().replace(/-/g, ''),
        'mosaicId': levy.mosaic,
        'fee': levy.fee,
    } : null;
    let custom = {
        'creationFeeSink': rentalFeeSink.replace(/-/g, ''),
        'creationFee': rentalFee,
        'mosaicDefinition': {
            'creator': senderPublicKey,
            'id': {
                'namespaceId': namespaceParent,
                'name': mosaicName,
            },
            'description': mosaicDescription,
            'properties': Object.keys(mosaicProperties).map((key, index) => {
                return { "name": key, "value": mosaicProperties[key].toString() };
            }),
            'levy': levyData
        },
        'fee': fee
    };
    var entity = Helpers.extendObj(data, custom);
    return entity;
}

module.exports = {
    prepare
}