import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
    queryParams: {
        page: {
            refreshModel: true
        },
        speaker: {
            refreshModel: false
        },
        book: {
            refreshModel: false
        },
        date: {
            refreshModel: false
        },
    },
    model({ page, speaker, book, date }) {
        const query = {
            _page: page,
            _limit: 3,
        };
        if(speaker) { 
            query.speaker = speaker;
        }
        if(book) {
            query.book = book;
        }
        if(date) {
            query.date = date;
        }

        //return this.get('store').query('meeting', query);
        //return this.get('store').findAll('meeting');
        return RSVP.hash({
            meetings: this.get('store').query('meeting', query),
            speakers: this.get('store').findAll('speaker'),
            books: this.get('store').findAll('book')
        });
    },
    actions: {
        reloadModel() {
            this.refresh();
        },
    },
    setupController(controller, model) {
        this._super(...arguments);
    },
});
