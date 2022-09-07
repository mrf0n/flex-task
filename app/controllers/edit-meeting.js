import Controller from '@ember/controller';

 export default Controller.extend({
     actions: {
         async editmeeting() {
            let meetingModel = this.get('model');
             this.get('datameet') ?  meetingModel.set('Date', this.get('datameet')) : null;
             await meetingModel.save();
             this.set('datameet');
             this.transitionToRoute('meeting');
         }
     }
 });