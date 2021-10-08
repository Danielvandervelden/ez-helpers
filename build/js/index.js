/**
 *
 * @param { NodeList | HTMLCollection } collection an HTMLCollection/Nodelist of DOM elements.
 * @returns the HTMLCollection as an array.
 */
export var toArray = function (collection) {
    var arr = [];
    for (var i = collection.length; i--; arr.unshift(collection[i]))
        ;
    return arr;
};
