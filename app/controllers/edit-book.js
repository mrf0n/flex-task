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
        async edit_book() {
            let bookModel = this.get('model');

            const uploadData = get(this, 'uploadData');
            if(uploadData) {
                uploadData.url = `${ENV.backendURL}/FileUpload`;
                uploadData.submit().done(async (result) => {
                    await bookModel.set('coverURL', `/uploads/${result.filename}`);
                });
                await bookModel.save();
            }

            if(this.get('name')) bookModel.set('name', this.get('name'));
            if(this.get('author')) bookModel.set('author', this.get('author'));
            if(this.get('size')) bookModel.set('size', this.get('size'));
            if(this.get('description')) bookModel.set('description', this.get('description'));
            if(this.get('tags')) bookModel.set('tags', this.get('tags'));

            await bookModel.save();

            this.set('name'); this.set('author'); this.set('size'); this.set('description');
            this.transitionToRoute('book');
        },
        reset() {
            set(this, 'uploadData', null);
          }
    },
});