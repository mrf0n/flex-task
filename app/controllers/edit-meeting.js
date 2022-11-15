import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

 export default Controller.extend({
    store: service('store'),

    init() {
        this._super(...arguments);
    },

    actions: {
        async editmeeting() {
            try
            {let meetingModel = this.get('model');
            if(this.get('datameet')) {
                meetingModel.set('Date', this.get('datameet'));    
                meetingModel.reports.forEach(report => {
                    report.set('date', this.get('datameet'));
                    report.save();
                });
            }
            await meetingModel.save();


            this.setProperties({
                Date: undefined
            });
            this.transitionToRoute('meeting');}
            catch(e){
                let newLog = this.get('store').createRecord('log', 
                  {currentDate: new Date().toString(),
                  message: e.message,
                  currentURL: window.location.href,
                  ipAdress: '',})
                newLog.save();
                this.send('error', e);
                }
        },
        async deleteReport(report) {
            try
            {await report.destroyRecord();
            this.get('store').unloadRecord(report);}
            catch(e){
                let newLog = this.get('store').createRecord('log', 
                  {currentDate: new Date().toString(),
                  message: e.message,
                  currentURL: window.location.href,
                  ipAdress: '',})
                newLog.save();
                this.send('error', e);
                }
        }
    }
 });