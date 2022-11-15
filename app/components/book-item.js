import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    dataService: service('data'),

    init() {
        this._super(...arguments);
        // this.set('tags', A()); 
    },

    actions: {
        async deletebook(book) {
            // await this.get('dataService').delete_book(book);
            // await book.destroyRecord();
            // this.get('store').unloadRecord(book);
            // this.transitionToRoute('books');
            try{
            this.destroybook(book);
            }
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
    }
});
