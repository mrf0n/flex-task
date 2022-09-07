import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    store: service(),
    actions: {
        async editreport() {
            let reportModel = this.get('model');
            const id=reportModel.meeting.get('id');
             this.get('rating') ? reportModel.set('rate', this.get('rating')): null;
             
             await reportModel.save();


             this.set('rating');
             this.transitionToRoute('edit-meeting', id);
         },
         getBooks() {
             return this.get('store').findAll('book');
         }
     }
});
