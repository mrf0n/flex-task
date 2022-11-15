import Controller from '@ember/controller';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
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
    dataService: service('data'),
    i18n: service(),
    isFormValid: computed.alias('validations.isValid'),

     actions: {
        changeTags(newTags) {
            try
            {set(this, 'tags', [...newTags]);}
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
        changeUploadData(uploadData) {
            try
            {set(this, 'uploadData', uploadData);}
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
        async edit_book() {
            try
            {if (this.get('isFormValid')) {
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
            this.setProperties({
                name: undefined,
                author: undefined,
                size: undefined,
                description: undefined
            });
            this.transitionToRoute('book');
        }}
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
        reset() {
            set(this, 'uploadData', null);
          }
    },
});