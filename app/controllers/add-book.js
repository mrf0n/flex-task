import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
export default Controller.extend({
    dataService: service('data'),
    actions: {
         changeUploadData(uploadData) {
             set(this, 'uploadData', uploadData);
         },
         changeTags(newTags) {
             set(this, 'tags', [...newTags]);
         },
         //обложка по началу дефолтная, потом меняется едитом
         async makebook() {
             let bookobject;
             bookobject = await this.get("dataService").create_book({
                 name: this.get('name'),
                 author: this.get('author'),
                 size: this.get('size'),
                 description: this.get('desc'),
                 tags: this.get('tags'),
                 coverURL: "images/book-cover.jpg",
             });
             let image = get(this, 'uploadData');
             await this.get("dataService").edit_book({
                id: bookobject.id,
            }, image);
            this.set('name'); 
            this.set('author'); 
            this.set('size'); 
            this.set('desc');
            this.transitionToRoute('books');
        }   
    },
    reset() {
        set(this, 'uploadData', null);
      }
});
