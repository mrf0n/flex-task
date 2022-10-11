import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {

    queryParams: {
        search: {
            refreshModel: false
        }
    },

    model({ search }){
        return search ? this.get('store').query('speaker', {q: search}) : this.get('store').findAll('speaker');
    },
    actions: {
        refreshSpeakers() {
            this.refresh();
        }
    }
});
