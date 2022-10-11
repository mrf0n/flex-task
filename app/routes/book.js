import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
    queryParams: {
        search: {
            refreshModel: false,
        },
        tagslike: {
            refreshModel: false,
        }
    },

    model({ search, tagslike }){
        return search || tagslike ? this.get('store').query('book', { q: search, tags_like: tagslike }) : this.get('store').findAll("book");
    },
    actions: {
        refreshBooks(){
            this.refresh();
        },
    }
});
