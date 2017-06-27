/**
 * A wallet object
 *
 * @param {string} walletName - A wallet name
 * @param {string} addr - A primary account address
 * @param {boolean} brain - Is brain or not
 * @param {string} algo - A wallet algorithm
 * @param {object} encrypted - An encrypted private key object
 * @param {number} network - A network id
 *
 * @return {object} - A wallet object
 */
export default function(walletName, addr, brain, algo, encrypted, network) {
    return {
        "name": walletName,
        "accounts": {
            "0": {
                "brain": brain,
                "algo": algo,
                "encrypted": encrypted.ciphertext || "",
                "iv": encrypted.iv || "",
                "address": addr.toUpperCase().replace(/-/g, ''),
                "label": 'Primary',
                "network": network,
            }
        }
    };
}