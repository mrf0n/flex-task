import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
export default Controller.extend({
     dataService: service('data'),

     actions: {
         async makespeaker() {
             await this.get("dataService").create_speaker({
                 name: this.get('name'),
                 surname: this.get('surname'),
                 famility: this.get('famility'),
             });
             this.transitionToRoute('speakers');
         }
     }
 });
