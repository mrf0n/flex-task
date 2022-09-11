import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    store: service('store'),

    init() {
        this._super(...arguments);
    },

    actions: {
        async addMeeting() {
            let meetingModel = this.get('model');
            if(this.get('datameet')) {
                meetingModel.set('Date', this.get('datameet'));
                meetingModel.reports.forEach(report => {
                    report.set('Date', this.get('datameet'));
                    report.save();
                });
                await meetingModel.save();
                this.set('datameet');
                this.transitionToRoute('meeting');
            }
            else alert('не указана дата!')
        },
        async deleteMeeting(meeting) {
            let temp = meeting;
            await meeting.destroyRecord();
            temp.reports.forEach(report => {
                report.destroyRecord();
                this.get('store').unloadRecord(report);
            });
            this.get('store').unloadRecord(meeting);
            this.transitionToRoute('meeting');
        },
        async deleteReport(report) {
            await report.destroyRecord();
            this.get('store').unloadRecord(report);
        }
    }
});
