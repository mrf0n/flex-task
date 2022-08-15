import Controller from '@ember/controller';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
    dataService: service('data'),

     actions: {
        changeTags(newTags) {
            set(this, 'tags', [...newTags]);
      
            // eslint-disable-next-line no-console
            // console.log(get(this, 'tags'));
          },
        changeUploadData(uploadData) {
            set(this, 'uploadData', uploadData);
        },
         async edit_book(id_book) {
            const uploadData = get(this, 'uploadData');
            await this.get("dataService").edit_book({
                id: parseInt(id_book),
                name: this.get('name'),
                author: this.get('author'),
                size: this.get('size'),
                description: this.get('desc'),
                tags: this.get('tags'),
            }, uploadData);
            this.set('name'); 
            this.set('author'); 
            this.set('size'); 
            this.set('desc');
            this.transitionToRoute('books');
        },
        reset() {
            set(this, 'uploadData', null);
          }
    },
});