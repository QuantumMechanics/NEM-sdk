/**
 * An account object
 *
 * @param {string} address - A NEM account address
 * @param {string} label - An account label
 * @param {string} child - A child public key (remote account)
 * @param {string} encrypted - An encrypted private key
 * @param {string} iv - IV of the encrypted private key
 *
 * @return {object} - An account object
 */
export default function(address, label, child, encrypted, iv) {
    return {
        "address": address || "",
        "label": label || "",
        "child": child || "",
        "encrypted": encrypted || "",
        "iv": iv || ""
    }
}