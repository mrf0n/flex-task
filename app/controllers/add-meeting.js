import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { get, set } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';
import { computed } from '@ember/object';

const Validations = buildValidations({
    meetdate: [
        validator('ds-error'),
        validator('presence', true),
        validator('format', { type: 'date' })
    ]
});

export default Controller.extend(Validations, {
    store: service('store'),
    currentUser: service(),
    i18n: service(),
    isFormValid: computed.alias('validations.isValid'),

    init() {
        this._super(...arguments);
    },

    actions: {
        async addMeeting() {
            try
            {if (this.get('isFormValid')) {
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
        }}
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
        async deleteMeeting(meeting) {
            try
            {let cureentmeet = meeting; 
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
           { await report.destroyRecord();
            this.store.unloadRecord(report);}
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
