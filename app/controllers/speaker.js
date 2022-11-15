import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';

export default Controller.extend({
    dataService: service('data'),
    store: service('store'),
    queryParams: ["search"],
    search: '',
    actions: {
        refreshlist(event) {
            debounce(() => {try
            {this.send("refreshSpeakers");}
            catch(e){
                let newLog = this.get('store').createRecord('log', 
                  {currentDate: new Date().toString(),
                  message: e.message,
                  currentURL: window.location.href,
                  ipAdress: '',})
                newLog.save();
                this.send('error', e);
                };}, 1000)
        },
        async deleteSpeaker(speaker) {
            try
            {await speaker.destroyRecord();
            this.store.unloadRecord(speaker);}
            catch(e){
                let newLog = this.get('store').createRecord('log', 
                  {currentDate: new Date().toString(),
                  message: e.message,
                  currentURL: window.location.href,
                  ipAdress: '',})
                newLog.save();
                this.send('error', e);
                }
        }
    }
});