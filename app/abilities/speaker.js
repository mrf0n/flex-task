import { computed } from '@ember/object';
import { Ability } from 'ember-can';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';

export default Ability.extend({
  currentUser: service(),
  session: service(),

  // only the person who wrote a post can edit it
  canEdit: computed(function () {
    if (!this.get('session.isAuthenticated')) {
      return false;
    }
    return new Promise((resolve, reject) => {
        this.get('currentUser.user.email') === 'admin@admin.ru' ? resolve(true) : reject(false);
    });

  }).volatile()
});