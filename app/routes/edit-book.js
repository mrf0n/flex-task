import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';

export default Route.extend({
    dataService: service('data'),

    model({ id }) {
        return this.get("dataService").get_book(id);
    }
});
