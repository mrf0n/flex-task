import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    dataService: service('data'),
    store: service('store'),
    queryParams: ["search"],
    search: '',
    actions: {
        refreshlist() {
            this.send("refreshSpeakers");
        },
        async deleteSpeaker(speaker) {
            await speaker.destroyRecord();
            this.store.unloadRecord(speaker);
        }
    }
});