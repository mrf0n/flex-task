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
            this.send("refreshBooks");
        },
        async deleteBook(book) {
            await book.destroyRecord();
            this.store.unloadRecord(book);
        },
    }
 });