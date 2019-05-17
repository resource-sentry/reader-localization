function convertObjectToKeyList(entity, list, parent = null) {
    for (let key in entity) {
        if (entity.hasOwnProperty(key) === true) {
            if (typeof entity[key] === 'object') {
                parent = parent || [];
                convertObjectToKeyList(entity[key], list, parent.concat(key));
            } else {
                list.push(parent === null ? key : parent.concat(key).join('.'));
            }
        }
    }

    list.sort();
}

module.exports = convertObjectToKeyList;
