import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    store: service(),
    actions: {
        async addReport() {
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
                    meeting: meetingModel
                };
                let newReport = this.get('store').createRecord('report', reportModel);
                await newReport.save();
                this.set('rate'); this.set('newBook'); this.set('newSpeaker'); this.set('newpresURL'); this.set('newclipURL'); this.set('newoverview');
                this.transitionToRoute('edit-meeting', meetingModel.get('id'));
            }
            else {
                alert('Выберите книгу и спикера!');
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
