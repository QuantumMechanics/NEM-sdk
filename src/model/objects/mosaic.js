/**
 * A mosaic attachment object
 *
 * @param {string} namespaceId - A namespace name
 * @param {string} mosaicName - A mosaic name
 * @param {number} quantity - A mosaic quantity (in uXEM)
 *
 * @return {object}
 */
let attachment = function(namespaceId, mosaicName, quantity) {
    return {
        "mosaicId": {
        	"namespaceId": namespaceId || "",
        	"name": mosaicName || ""
        },
        "quantity": quantity || 0
    }
};

let definitionMetaDataPair = function() {
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

module.exports = {
    attachment,
    definitionMetaDataPair
}