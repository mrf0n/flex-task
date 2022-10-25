import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { validator, buildValidations } from 'ember-cp-validations';
import { computed } from '@ember/object';

const Validations = buildValidations({
    surname: [
        validator('ds-error'),
        validator('presence', true)
    ],
    name: [
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
     currentUser: service(),
     i18n: service(),
     isFormValid: computed.alias('validations.isValid'),

     actions: {
         async makespeaker() {
            if (this.get('isFormValid')) {
            let speakerModel = {
                name: this.get('name'),
                surname: this.get('surname'),
                famility: this.get('famility'),
                user: this.get('currentUser.user')
            };
            
            let newSpeaker = this.get('store').createRecord('speaker', speakerModel);
            newSpeaker.serialize();
            await newSpeaker.save();
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
