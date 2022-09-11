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
            let temp = meeting; 
            let temp2 =[], temp3=[];

            temp.get('reports').toArray().forEach(report => {
                temp2.push(report);
                const promise = report.destroyRecord();
                temp3.push(promise);
            });
            await RSVP.all(temp3);
            temp2.forEach(report => {
                this.get('store').unloadRecord(report);
            })
            await meeting.destroyRecord();
            this.get('store').unloadRecord(meeting);
        },
    }
});
