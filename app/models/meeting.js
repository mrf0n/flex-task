import DS from 'ember-data';

export default DS.Model.extend({
    Date: DS.attr('date-string'),

    reports: DS.hasMany('report'),

    user: DS.belongsTo('user')
});
