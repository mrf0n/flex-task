import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

 export default Controller.extend({
    store: service('store'),

    init() {
        this._super(...arguments);
    },

    actions: {
        async editmeeting() {
            let meetingModel = this.get('model');
            if(this.get('datameet')) {
                meetingModel.set('Date', this.get('datameet'));    
                meetingModel.set('Date', this.get('datameet'));
                meetingModel.reports.forEach(report => {
                    report.set('Date', this.get('datameet'));
                    report.save();
                });
            }
            await meetingModel.save();


            this.setProperties({
                Date: undefined
            });
            this.transitionToRoute('meeting');
        },
        async deleteReport(report) {
            await report.destroyRecord();
            this.get('store').unloadRecord(report);
        }
    }
 });