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