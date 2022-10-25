import Controller from '@ember/controller';
import ENV from 'h-work-2/config/environment';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';
import { computed } from '@ember/object';

const Validations = buildValidations({
    name: [
        validator('ds-error'),
        validator('presence', true)
    ],
    author: [
        validator('ds-error'),
        validator('presence', true)
    ],
    size: [
        validator('ds-error'),
        validator('presence', true)
    ],
  });

export default Controller.extend(Validations, {
    i18n: service(),
    isFormValid: computed.alias('validations.isValid'),
    dataService: service('data'),
    actions: {
         changeUploadData(uploadData) {
             set(this, 'uploadData', uploadData);
         },
         changeTags(newTags) {
             set(this, 'tags', [...newTags]);
         },
         

    async makebook() {
        if (this.get('isFormValid')) {
        const uploadData = get(this, 'uploadData');
        let coverURL = new Promise((resolve, reject) => {
            if(uploadData) {
                uploadData.url = `${ENV.backendURL}/FileUpload`;
                uploadData.submit().done((result) => {
                    resolve(`/uploads/${result.filename}`);
                });
            }
            else resolve("images/book-cover.jpg");
        });

        let tags = this.get('tags') ? this.get('tags') : [];
        let bookModel = {
            name: this.get('name'),
            author: this.get('author'),
            size: this.get('size'),
            description: this.get('description'),
            coverURL: await coverURL,
            tags: this.get('tags'),
            user: this.get('currentUser.user')
        };

        let newBook = this.get('store').createRecord('book', bookModel);
        newBook.serialize();
        await newBook.save();
        this.setProperties({
            name: undefined,
            author: undefined,
            size: undefined,
            description: undefined,
        });

        this.transitionToRoute('book');
    }
},   
    reset() {
        set(this, 'uploadData', null);
      }
    }
});
