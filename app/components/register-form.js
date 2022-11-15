import Component from '@ember/component';
import fetch from 'fetch';
import EmberObject, { get, computed } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';
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
  iAmRobot: true,
  reset: false,
  isFormValid: computed.alias('validations.isValid'),
  i18n: service(),

  actions: {
    async saveUser(e) {
      try
    {  e.preventDefault();
    if (this.get('isFormValid')) {
      this.get('onSubmit')({
        email: this.email,
        password: this.password,
      });
    }
    }
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

    async verified(key) {
      try {
        const { success } = await (await fetch(`${ENV.backendURL}/recaptcha?key=${key}`)).json();

        this.set('iAmRobot', !success);
      } catch (error) {
        this.set('reset', true);
      }
    },

    expired() {
      this.set('iAmRobot', true);
    }
  },

  didReceiveAttrs() {
    this.setProperties({
      email: this.get('user.email'),
      password: this.get('user.password')
    });
  }
});