import Controller from '@ember/controller';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Controller.extend({
    actions: {
        async saveUser() {
          let newUser;
          let user = {
            email: this.get('email'),
            password: this.get('password')
          }
          try {
            newUser = this.get('store').createRecord('user', user);
            await newUser.save();
            this.transitionToRoute('index');
          }
          catch(e) {
            e.user = newUser;
            this.send('error', e);
          }
          this.setProperties({
            email: undefined,
            password: undefined
          });
        },
    
        error(error, transition) {
          this.set('errors', error.user.errors);
          return false;
        }
      },
    
      resetErrors() {
        this.set('errors', {});
      }
});
