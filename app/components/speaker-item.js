// import Component from '@ember/component';
// import { inject as service } from '@ember/service';

// export default Component.extend({
    // dataService: service('data'),

    // actions: {
    //     async delete_speaker(speaker) {
    //         await this.get('dataService').delete_speaker(speaker);
    //         // this.transitionToRoute('speakers');
    //     }
    // }
    import Component from '@ember/component';
    import { inject as service } from '@ember/service';

    export default Component.extend({

        init() {
            this._super(...arguments);
        },

        actions: {
            async deletespeaker(speaker) {
                // await speaker.destroyRecord();
                // this.get('store').unloadRecord(speaker);
                try
                {this.destroyspeaker(speaker);}
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
