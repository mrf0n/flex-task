import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { validator, buildValidations } from 'ember-cp-validations';
import { computed } from '@ember/object';


const Validations = buildValidations({
    newpresURL: [
        validator('ds-error'),
        validator('presence', true),
        validator('format', { type: 'url' })
    ],
    newclipURL: [
        validator('ds-error'),
        validator('presence', true),
        validator('format', { type: 'url' })
    ],
  });

export default Controller.extend(Validations, {
    store: service(),
    currentUser: service(),
    i18n: service(),
    isFormValid: computed.alias('validations.isValid'),
    
    actions: {
        async addReport() {
            try
            {if (this.get('isFormValid')) {
            let meetingModel = this.get('model').meeting;
            if(this.get('newBook') && this.get('newSpeaker'))
            {
                let reportModel = {
                    date: meetingModel.get('Date'),
                    rate: this.get('rate'),
                    presentationURL: this.get('newpresURL'),
                    clipURL: this.get('newclipURL'),
                    overview: this.get('newoverview'),
                    book: this.get('newBook'),
                    speaker: this.get('newSpeaker'),
                    meeting: meetingModel,
                    user: this.get('currentUser.user')
                };
                let newReport = this.get('store').createRecord('report', reportModel);
                newReport.serialize();
                await newReport.save();
                this.setProperties({
                    date: undefined,
                    rate: undefined,
                    presentationURL: undefined,
                    clipURL: undefined,
                    overview: undefined,
                    newBook: null,
                    newSpeaker: null
                });
                
                this.transitionToRoute('edit-meeting', meetingModel.get('id'));
            }
            else {
                alert('Выберите книгу и спикера!');
            }
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
        getBooks() {
            return this.get('store').findAll('book');
        },
        getSpeakers() {
            return this.get('store').findAll('speaker');
        }
    }
});
