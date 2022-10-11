import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
export default Controller.extend({
     dataService: service('data'),
     currentUser: service(),

     actions: {
         async makespeaker() {
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
});
