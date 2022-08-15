import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import {Promise} from 'rsvp';
import {later} from '@ember/runloop';

export default Route.extend({

    queryParams: {
        search: {
            refreshModel: false
        }
    },

    dataService: service('data'),

    model({ search }){
        return new Promise((resolve, reject) => {
            later(async()=> {
                try{
                    let books = search ? this.get("dataService").get_speakers(search) : this.get("dataService").get_speakers();
                    resolve(books);
                }
                catch(e){
                    reject('Connection failed');
                }
            },1000);
        })
    },
    actions: {
        refreshSpeakers() {
            this.refresh();
        }
    }
});
