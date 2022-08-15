import Controller from '@ember/controller';
 import { inject as service } from '@ember/service';

 export default Controller.extend({
     dataService: service('data'),
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
    }
 });