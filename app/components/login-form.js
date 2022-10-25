import Component from '@ember/component';
import fetch from 'fetch';
import { validator, buildValidations } from 'ember-cp-validations';
import EmberObject, { get, computed } from '@ember/object';
import ENV from 'h-work-2/config/environment';
import { inject as service } from '@ember/service';

const Validations = buildValidations({
  email: [
    validator('ds-error'),
    validator('presence', true),
    validator('format', { type: 'email' })
  ],
  password: [
    validator('ds-error'),
    validator('presence', {
      presence: true,
    }),
    validator('length', {
      min: 3,
      max: 12
    })
  ]
});

export default Component.extend(Validations, {
  i18n: service(),
  isFormValid: computed.alias('validations.isValid'),

  actions: {
    login(e) {
      e.preventDefault();
      if (this.get('isFormValid')) {
      this.get('onSubmit')({
        email: this.email,
        password: this.password
      });
    }
  }
  },

  didReceiveAttrs() {
    this.setProperties({
      email: this.get('user.email'),
      password: this.get('user.password')
    });
  }
});