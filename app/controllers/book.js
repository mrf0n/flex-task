import Controller from '@ember/controller';
 import { inject as service } from '@ember/service';

 export default Controller.extend({
     dataService: service('data'),
     store: service('store'),
     queryParams: ["search", "tagslike"],
     search: '',
     tagslike: '',
     init() {
        this._super(...arguments);
     },
     actions: {
        refreshlist() {
            try
            {this.send("refreshBooks");}
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
        async deleteBook(book) {
            try
            {await book.destroyRecord();
            this.store.unloadRecord(book);}
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