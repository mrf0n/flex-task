import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    dataService: service('data'),

        actions: {
            async edit_speaker() {
                // await this.get("dataService").edit_speaker({
                //     id: parseInt(id_speaker),
                //     name: this.get('name'),
                //     surname: this.get('surname'),
                //     famility: this.get('famility'),
                // })

                let speakerModel = this.get('model');
                this.get('name') ? speakerModel.set('name', this.get('name')) : null;
                this.get('surname') ? speakerModel.set('surname', this.get('surname')) : null;
                this.get('famility') ? speakerModel.set('famility', this.get('famility')) : null;
       
                await speakerModel.save();

                this.set('name'); 
                this.set('surname'); 
                this.set('famility');
                this.transitionToRoute('speaker');
            }
        }
});