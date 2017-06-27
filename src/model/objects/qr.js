/**
 * An account info object for mobile QR
 *
 * @param {number} version - A version number
 * @param {number} type - A type number
 * @param {string} address - A NEM address
 * @param {string} name - An account name
 *
 * @return {object} - An account info object
 */
let accountInfo = function(version, type, address, name) {
    return {
        "v": version || "",
        "type": 1 || "",
        "data": {
            "addr": address || "",
            "name": name || ""
        }
    }
}

/**
 * A wallet object for mobile QR
 *
 * @param {number} version - A version number
 * @param {number} type - An type number
 * @param {string} name - A wallet name
 * @param {string} encrypted - An encrypted primary private key
 * @param {string} salt - Salt of the encrypted private key
 *
 * @return {object} - A wallet object
 */
let wallet = function(version, type, name, encrypted, salt) {
    return {
        "v": version || "",
        "type": type || "",
        "data": {
            "name": name || "",
            "priv_key": encrypted || "",
            "salt": salt || ""
        }
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

module.exports = {
    accountInfo,
    wallet,
    invoice
}