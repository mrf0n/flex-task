import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import {Promise} from 'rsvp';
import {later} from '@ember/runloop';

export default Route.extend({
    queryParams: {
        search: {
            refreshModel: false,
        },
        tagslike: {
            refreshModel: false,
        }
    },
    
    // dataService: service('data'),

    model({ search, tagslike }){
        // return new Promise((resolve, reject) => {
        //     later(async()=> {
        //         try{
        //             let books = search || tagslike ? this.get("dataService").get_books(search, tagslike) : this.get("dataService").get_books();
        //             resolve(books);
        //         }
        //         catch(e){
        //             reject('Connection failed');
        //         }
        //     },1000);
        // })
        return search || tagslike ? this.get('store').query('book', { q: search, tags_like: tagslike }) : this.get('store').findAll("book");
    },
    actions: {
        refreshBooks(){
            this.refresh();
        },
    }
});
