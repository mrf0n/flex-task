import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { validator, buildValidations } from 'ember-cp-validations';
import { computed } from '@ember/object';

const Validations = buildValidations({
    name: [
        validator('ds-error'),
        validator('presence', true)
    ],
    surname: [
        validator('ds-error'),
        validator('presence', true)
    ],
    famility: [
        validator('ds-error'),
        validator('presence', true)
    ],
  });

export default Controller.extend(Validations, {
    dataService: service('data'),
    i18n: service(),
    isFormValid: computed.alias('validations.isValid'),
        actions: {
            async edit_speaker() {
                if (this.get('isFormValid')) {
                let speakerModel = this.get('model');
                this.get('name') ? speakerModel.set('name', this.get('name')) : undefined;
                this.get('surname') ? speakerModel.set('surname', this.get('surname')) : undefined;
                this.get('famility') ? speakerModel.set('famility', this.get('famility')) : undefined;
       
                await speakerModel.save();
                this.setProperties({
                    name: undefined,
                    surname: undefined,
                    famility: undefined
                });
 
                this.transitionToRoute('speaker');
            }
            }
        }
});