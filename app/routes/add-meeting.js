import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
    datameet: "Укажите дату",

    model({ id }) {
        if(id == 0) { 
            let newMeeting = this.get('store').createRecord('meeting');
            return newMeeting.save();
        }
        else {
            return this.get('store').findRecord('meeting', id);
        }
    }
});