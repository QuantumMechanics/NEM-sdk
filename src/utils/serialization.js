import convert from './convert';
import Format from './format';
import TransactionTypes from '../model/transactionTypes';

/** *
 * NOTE, related to serialization: Unfortunately we need to create few objects
 * and do a bit of copying, as Uint32Array does not allow random offsets
 */

/* safe string - each char is 8 bit */
const _serializeSafeString = function (str) {
  const r = new ArrayBuffer(132);
  const d = new Uint32Array(r);
  const b = new Uint8Array(r);

  let e = 4;
  if (str === null) {
    d[0] = 0xffffffff;
  } else {
    d[0] = str.length;
    for (let j = 0; j < str.length; ++j) {
      b[e++] = str.charCodeAt(j);
    }
  }
  return new Uint8Array(r, 0, e);
};

const _serializeUaString = function (str) {
  const r = new ArrayBuffer(516);
  const d = new Uint32Array(r);
  const b = new Uint8Array(r);

  let e = 4;
  if (str === null) {
    d[0] = 0xffffffff;
  } else {
    d[0] = str.length;
    for (let j = 0; j < str.length; ++j) {
      b[e++] = str[j];
    }
  }
  return new Uint8Array(r, 0, e);
};

const _serializeLong = function (value) {
  const r = new ArrayBuffer(8);
  const d = new Uint32Array(r);
  d[0] = value;
  d[1] = Math.floor((value / 0x100000000));
  return new Uint8Array(r, 0, 8);
};

const _serializeMosaicId = function (mosaicId) {
  const r = new ArrayBuffer(264);
  const serializedNamespaceId = _serializeSafeString(mosaicId.namespaceId);
  const serializedName = _serializeSafeString(mosaicId.name);

  const b = new Uint8Array(r);
  const d = new Uint32Array(r);
  d[0] = serializedNamespaceId.length + serializedName.length;
  let e = 4;
  for (let j = 0; j < serializedNamespaceId.length; ++j) {
    b[e++] = serializedNamespaceId[j];
  }
  for (let j = 0; j < serializedName.length; ++j) {
    b[e++] = serializedName[j];
  }
  return new Uint8Array(r, 0, e);
};

const _serializeMosaicAndQuantity = function (mosaic) {
  const r = new ArrayBuffer(4 + 264 + 8);
  const serializedMosaicId = _serializeMosaicId(mosaic.mosaicId);
  const serializedQuantity = _serializeLong(mosaic.quantity);

  // $log.info(convert.ua2hex(serializedQuantity), serializedMosaicId, serializedQuantity);

  const b = new Uint8Array(r);
  const d = new Uint32Array(r);
  d[0] = serializedMosaicId.length + serializedQuantity.length;
  let e = 4;
  for (let j = 0; j < serializedMosaicId.length; ++j) {
    b[e++] = serializedMosaicId[j];
  }
  for (let j = 0; j < serializedQuantity.length; ++j) {
    b[e++] = serializedQuantity[j];
  }
  return new Uint8Array(r, 0, e);
};
const _serializeMosaics = function (entity) {
  const r = new ArrayBuffer(276 * 10 + 4);
  const d = new Uint32Array(r);
  const b = new Uint8Array(r);

  let i = 0;
  let e = 0;

  d[i++] = entity.length;
  e += 4;

  const temporary = [];
  for (let j = 0; j < entity.length; ++j) {
    temporary.push({
      entity: entity[j],
      value: `${Format.mosaicIdToName(entity[j].mosaicId)} : ${entity[j].quantity}`,
    });
  }
  temporary.sort((first, second) => (first.value < second.value ? -1 : first.value > second.value));

  for (let j = 0; j < temporary.length; ++j) {
    const innerEntity = temporary[j].entity;
    const serializedMosaic = _serializeMosaicAndQuantity(innerEntity);
    for (let k = 0; k < serializedMosaic.length; ++k) {
      b[e++] = serializedMosaic[k];
    }
  }

  return new Uint8Array(r, 0, e);
};

const _serializeProperty = function (entity) {
  const r = new ArrayBuffer(1024);
  const d = new Uint32Array(r);
  const b = new Uint8Array(r);
  const serializedName = _serializeSafeString(entity.name);
  const serializedValue = _serializeSafeString(entity.value);
  d[0] = serializedName.length + serializedValue.length;
  let e = 4;
  for (let j = 0; j < serializedName.length; ++j) {
    b[e++] = serializedName[j];
  }
  for (let j = 0; j < serializedValue.length; ++j) {
    b[e++] = serializedValue[j];
  }
  return new Uint8Array(r, 0, e);
};

const _serializeProperties = function (entity) {
  const r = new ArrayBuffer(1024);
  const d = new Uint32Array(r);
  const b = new Uint8Array(r);

  let i = 0;
  let e = 0;

  d[i++] = entity.length;
  e += 4;

  const temporary = [];
  for (let j = 0; j < entity.length; ++j) {
    temporary.push(entity[j]);
  }

  const helper = {
    divisibility: 1,
    initialSupply: 2,
    supplyMutable: 3,
    transferable: 4,
  };
  temporary.sort((first, second) => (helper[first.name] < helper[second.name] ? -1 : helper[first.name] > helper[second.name]));

  for (let j = 0; j < temporary.length; ++j) {
    const innerEntity = temporary[j];
    const serializedProperty = _serializeProperty(innerEntity);
    for (let k = 0; k < serializedProperty.length; ++k) {
      b[e++] = serializedProperty[k];
    }
  }
  return new Uint8Array(r, 0, e);
};

const _serializeLevy = function (entity) {
  const r = new ArrayBuffer(1024);
  const d = new Uint32Array(r);

  if (entity === null) {
    d[0] = 0;
    return new Uint8Array(r, 0, 4);
  }

  const b = new Uint8Array(r);
  d[1] = entity.type;

  let e = 8;
  const temp = _serializeSafeString(entity.recipient);
  for (let j = 0; j < temp.length; ++j) {
    b[e++] = temp[j];
  }

  const serializedMosaicId = _serializeMosaicId(entity.mosaicId);
  for (let j = 0; j < serializedMosaicId.length; ++j) {
    b[e++] = serializedMosaicId[j];
  }

  const serializedFee = _serializeLong(entity.fee);
  for (let j = 0; j < serializedFee.length; ++j) {
    b[e++] = serializedFee[j];
  }

  d[0] = 4 + temp.length + serializedMosaicId.length + 8;

  return new Uint8Array(r, 0, e);
};

const _serializeMosaicDefinition = function (entity) {
  const r = new ArrayBuffer(40 + 264 + 516 + 1024 + 1024);
  const d = new Uint32Array(r);
  const b = new Uint8Array(r);

  let temp = convert.hex2ua(entity.creator);
  d[0] = temp.length;
  let e = 4;
  for (let j = 0; j < temp.length; ++j) {
    b[e++] = temp[j];
  }

  const serializedMosaicId = _serializeMosaicId(entity.id);
  for (let j = 0; j < serializedMosaicId.length; ++j) {
    b[e++] = serializedMosaicId[j];
  }

  const utf8ToUa = convert.hex2ua(convert.utf8ToHex(entity.description));
  temp = _serializeUaString(utf8ToUa);
  for (let j = 0; j < temp.length; ++j) {
    b[e++] = temp[j];
  }

  temp = _serializeProperties(entity.properties);
  for (let j = 0; j < temp.length; ++j) {
    b[e++] = temp[j];
  }

  const levy = _serializeLevy(entity.levy);
  for (let j = 0; j < levy.length; ++j) {
    b[e++] = levy[j];
  }
  return new Uint8Array(r, 0, e);
};

/**
 * Serialize a transaction object
 *
 * @param {object} entity - A transaction object
 *
 * @return {Uint8Array} - The serialized transaction
 */
const serializeTransaction = function (entity) {
  const r = new ArrayBuffer(512 + 2764);
  let d = new Uint32Array(r);
  const b = new Uint8Array(r);
  d[0] = entity.type;
  d[1] = entity.version;
  d[2] = entity.timeStamp;

  let temp = convert.hex2ua(entity.signer);
  d[3] = temp.length;
  let e = 16;
  for (let j = 0; j < temp.length; ++j) {
    b[e++] = temp[j];
  }

  // Transaction
  let i = e / 4;
  d[i++] = entity.fee;
  d[i++] = Math.floor((entity.fee / 0x100000000));
  d[i++] = entity.deadline;
  e += 12;

  // TransferTransaction
  if (d[0] === TransactionTypes.transfer) {
    d[i++] = entity.recipient.length;
    e += 4;
    // TODO: check that entity['recipient'].length is always 40 bytes
    for (let j = 0; j < entity.recipient.length; ++j) {
      b[e++] = entity.recipient.charCodeAt(j);
    }
    i = e / 4;
    d[i++] = entity.amount;
    d[i++] = Math.floor((entity.amount / 0x100000000));
    e += 8;

    if (entity.message.type === 1 || entity.message.type === 2) {
      temp = convert.hex2ua(entity.message.payload);
      if (temp.length === 0) {
        d[i++] = 0;
        e += 4;
      } else {
        // length of a message object
        d[i++] = 8 + temp.length;
        // object itself
        d[i++] = entity.message.type;
        d[i++] = temp.length;
        e += 12;
        for (let j = 0; j < temp.length; ++j) {
          b[e++] = temp[j];
        }
      }
    }

    const entityVersion = d[1] & 0xffffff;
    if (entityVersion >= 2) {
      temp = _serializeMosaics(entity.mosaics);
      for (let j = 0; j < temp.length; ++j) {
        b[e++] = temp[j];
      }
    }

    // Provision Namespace transaction
  } else if (d[0] === TransactionTypes.provisionNamespace) {
    d[i++] = entity.rentalFeeSink.length;
    e += 4;
    // TODO: check that entity['rentalFeeSink'].length is always 40 bytes
    for (let j = 0; j < entity.rentalFeeSink.length; ++j) {
      b[e++] = entity.rentalFeeSink.charCodeAt(j);
    }
    i = e / 4;
    d[i++] = entity.rentalFee;
    d[i++] = Math.floor((entity.rentalFee / 0x100000000));
    e += 8;

    temp = _serializeSafeString(entity.newPart);
    for (let j = 0; j < temp.length; ++j) {
      b[e++] = temp[j];
    }

    temp = _serializeSafeString(entity.parent);
    for (let j = 0; j < temp.length; ++j) {
      b[e++] = temp[j];
    }

    // Mosaic Definition Creation transaction
  } else if (d[0] === TransactionTypes.mosaicDefinition) {
    temp = _serializeMosaicDefinition(entity.mosaicDefinition);
    d[i++] = temp.length;
    e += 4;
    for (let j = 0; j < temp.length; ++j) {
      b[e++] = temp[j];
    }

    temp = _serializeSafeString(entity.creationFeeSink);
    for (let j = 0; j < temp.length; ++j) {
      b[e++] = temp[j];
    }

    temp = _serializeLong(entity.creationFee);
    for (let j = 0; j < temp.length; ++j) {
      b[e++] = temp[j];
    }

    // Mosaic Supply Change transaction
  } else if (d[0] === TransactionTypes.mosaicSupply) {
    const serializedMosaicId = _serializeMosaicId(entity.mosaicId);
    for (let j = 0; j < serializedMosaicId.length; ++j) {
      b[e++] = serializedMosaicId[j];
    }

    temp = new ArrayBuffer(4);
    d = new Uint32Array(temp);
    d[0] = entity.supplyType;
    const serializeSupplyType = new Uint8Array(temp);
    for (let j = 0; j < serializeSupplyType.length; ++j) {
      b[e++] = serializeSupplyType[j];
    }

    const serializedDelta = _serializeLong(entity.delta);
    for (let j = 0; j < serializedDelta.length; ++j) {
      b[e++] = serializedDelta[j];
    }

    // Signature transaction
  } else if (d[0] === TransactionTypes.multisigSignature) {
    temp = convert.hex2ua(entity.otherHash.data);
    // length of a hash object....
    d[i++] = 4 + temp.length;
    // object itself
    d[i++] = temp.length;
    e += 8;
    for (let j = 0; j < temp.length; ++j) {
      b[e++] = temp[j];
    }
    i = e / 4;

    temp = entity.otherAccount;
    d[i++] = temp.length;
    e += 4;
    for (let j = 0; j < temp.length; ++j) {
      b[e++] = temp.charCodeAt(j);
    }

    // Multisig wrapped transaction
  } else if (d[0] === TransactionTypes.multisigTransaction) {
    temp = serializeTransaction(entity.otherTrans);
    d[i++] = temp.length;
    e += 4;
    for (let j = 0; j < temp.length; ++j) {
      b[e++] = temp[j];
    }

    // Aggregate Modification transaction
  } else if (d[0] === TransactionTypes.multisigModification) {
    // Number of modifications
    temp = entity.modifications;
    d[i++] = temp.length;
    e += 4;

    for (let j = 0; j < temp.length; ++j) {
      // Length of modification structure
      d[i++] = 0x28;
      e += 4;
      // Modification type
      if (temp[j].modificationType === 1) {
        d[i++] = 0x01;
      } else {
        d[i++] = 0x02;
      }
      e += 4;
      // Length of public key
      d[i++] = 0x20;
      e += 4;

      const key2bytes = convert.hex2ua(entity.modifications[j].cosignatoryAccount);

      // Key to Bytes
      for (let k = 0; k < key2bytes.length; ++k) {
        b[e++] = key2bytes[k];
      }
      i = e / 4;
    }

    const entityVersion = d[1] & 0xffffff;
    if (entityVersion >= 2) {
      d[i++] = 0x04;
      e += 4;
      // Relative change
      d[i++] = entity.minCosignatories.relativeChange.toString(16);
      e += 4;
    } else {
      // Version 1 has no modifications
    }
  } else if (d[0] === TransactionTypes.importanceTransfer) {
    d[i++] = entity.mode;
    e += 4;
    d[i++] = 0x20;
    e += 4;
    const key2bytes = convert.hex2ua(entity.remoteAccount);

    // Key to Bytes
    for (let k = 0; k < key2bytes.length; ++k) {
      b[e++] = key2bytes[k];
    }
  }

  return new Uint8Array(r, 0, e);
};

module.exports = {
  _serializeSafeString,
  _serializeUaString,
  _serializeLong,
  _serializeMosaicId,
  _serializeMosaicAndQuantity,
  _serializeMosaics,
  _serializeProperty,
  _serializeProperties,
  _serializeLevy,
  _serializeMosaicDefinition,
  serializeTransaction,
};
