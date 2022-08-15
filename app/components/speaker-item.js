import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    dataService: service('data'),

    actions: {
        async delete_speaker(speaker) {
            await this.get('dataService').delete_speaker(speaker);
            // this.transitionToRoute('speakers');
        }
    }
});
