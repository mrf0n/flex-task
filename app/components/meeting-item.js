import Component from '@ember/component';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Component.extend({
    
    store: service('store'),

    init() {
        this._super(...arguments);
    },

    actions: {
        async deleteMeeting(meeting) {
            this.destroymeeting(meeting);
        },
    }
});
