import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    dataService: service('data'),

        actions: {
            async edit_speaker(id_speaker) {
                await this.get("dataService").edit_speaker({
                    id: parseInt(id_speaker),
                    name: this.get('name'),
                    surname: this.get('surname'),
                    famility: this.get('famility'),
                })
                this.set('name'); 
                this.set('surname'); 
                this.set('famility');
                this.transitionToRoute('speakers');
            }
        }
});