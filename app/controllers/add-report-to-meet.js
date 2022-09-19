import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    store: service(),
    actions: {
        async addReport() {
            let meetingModel = this.get('model').meeting;
            let id = meetingModel.get('id');
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
                newReport.serialize();
                await newReport.save();
                this.setProperties({
                    date: undefined,
                    rate: undefined,
                    presentationURL: undefined,
                    clipURL: undefined,
                    overview: undefined,
                });
                
                this.transitionToRoute('edit-meeting', id);
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
