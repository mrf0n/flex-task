import Controller from '@ember/controller';
import { computed } from '@ember/object';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Controller.extend({
    store: service('store'),

    queryParams: ['page', 'book', 'speaker', 'date'],
    page: 1,
    book: '',
    speaker: '',
    date : '',

    pages: computed('model.meetings.meta.total', function() {
        const total = Number(this.get('model.meetings.meta.total'));
        if (Number.isNaN(total) || total <= 0) {
          return [];
        }

        return new Array(Math.ceil(total / 2))
          .fill()
          .map((value, index) => index + 1);
    }),

    selectedSpeaker: computed('speaker', function() {
        const speaker = this.get('speaker');
        return speaker ? this.get('model.speakers').findBy('id', speaker) : null;
    }),

    selectedBook: computed('book', function() {
        const book = this.get('book');
        return book ? this.get('model.books').findBy('id', book) : null;
    }),

    actions: {
        getBooks() {
            return this.store.findAll('book');
        },
        getSpeakers() {
            return this.store.findAll('speaker');
        },
        changeSpeaker(speaker) {
            this.set('speaker', speaker ? speaker.get('id') : '');
        },

        changeBook(book) {
            this.set('book', book ? book.get('id') : '');
        },

        changeDate(date) {
            this.set('date', date ? date.get('id') : '');
        },
        updatePage() {
            this.send("reloadModel");
        },

        cleanSearchParam() {
            this.set('book', '');
            this.set('speaker', '');
            this.set('date', '');
            this.send("reloadModel");
        }
    }
})