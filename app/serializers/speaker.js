// import DS from 'ember-data';

// export default DS.JSONSerializer.extend({
//     normalize(model, hash) {
//         hash = this._super(...arguments);
//         let hashCopy = Object.assign({}, hash);
//         hashCopy.attributes = {};
//         hashCopy.attributes.name = hashCopy.name;
//         // hashCopy.attributes.id = hashCopy.id;
//         hashCopy.attributes.surname = hashCopy.surname;
//         hashCopy.attributes.famility = hashCopy.famility;
//         // delete hashCopy.id;
//         delete hashCopy.name;
//         delete hashCopy.surname;
//         delete hashCopy.famility;
//         hash = {
//           data: hashCopy
//         };
    
//         return hash;
//       },
// });

import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    normalize(model, hash) {
        hash = this._super(...arguments);
        return hash;
    },
    // serialize(snapshot, options) {
    //     let json = this._super(...arguments);
    //     json.type = snapshot.modelName;
    //     return json;
    // }
});