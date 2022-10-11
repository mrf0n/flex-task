import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Controller.extend({
    store: service('store'),
    currentUser: service(),

    init() {
        this._super(...arguments);
    },

    actions: {
        async addMeeting() {
            let meetingModel = this.get('model');
            if(this.get('datameet')) {
                meetingModel.set('Date', this.get('datameet'));
                meetingModel.set('user', this.get('currentUser.user'));
                meetingModel.reports.forEach(report => {
                    report.set('date', this.get('datameet'));
                    report.save();
                });
                await meetingModel.save();

                this.setProperties({
                    Date: undefined
                });
                this.transitionToRoute('meeting');
            }
            else alert('Поле даты не заполнено!')
        },
        async deleteMeeting(meeting) {
            let cureentmeet = meeting; 
            let reportcache = [];
            let promisesarr = [];
            let meetarr = cureentmeet.get('reports').toArray();;
            meetarr.forEach(report => {
                reportcache.push(report);
                promisesarr.push(report.destroyRecord());
            });
            await RSVP.all(promisesarr);

            reportcache.forEach(report => {
                this.store.unloadRecord(report);
            })
            await meeting.destroyRecord();
            this.store.unloadRecord(meeting);
            this.transitionToRoute('meeting');
        },
        async deleteReport(report) {
            await report.destroyRecord();
            this.store.unloadRecord(report);
        }
    }
});
