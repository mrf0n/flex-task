import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    dataService: service('data'),

        actions: {
            async edit_speaker() {
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
});