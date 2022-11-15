import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    store: service(),
    actions: {
        async editreport() {
            try
            {let reportModel = this.get('model');
            this.get('rate') ? reportModel.set('rate', this.get('rate')) : undefined;
            this.get('newpresURL') ? reportModel.set('presentationURL', this.get('newpresURL')) : undefined;
            this.get('clipURL') ? reportModel.set('videoURL', this.get('newclipURL')) : undefined;
            this.get('newoverview') ? reportModel.set('overview', this.get('newoverview')) : undefined;
            if(this.get('newBook')) reportModel.set('book', this.get('newBook'));
            if(this.get('newSpeaker')) reportModel.set('speaker', this.get('newSpeaker'));

            await reportModel.save();
            this.setProperties({
                rate: undefined,
                newpresURL: undefined,
                clipURL:undefined,
                newoverview: undefined
            });

            this.transitionToRoute('edit-meeting', reportModel.meeting.get('id'));}
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
