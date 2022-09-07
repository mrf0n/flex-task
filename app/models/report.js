import DS from 'ember-data';

 export default DS.Model.extend({
     date: DS.attr('date-string'),
     rate: DS.attr('string'),
     clipURL: DS.attr('string'),
     presentationURL: DS.attr('string'),
     overview:  DS.attr('string'),

     book: DS.belongsTo('book'),
     speaker: DS.belongsTo('speaker'),
     meeting: DS.belongsTo('meeting')
 });
