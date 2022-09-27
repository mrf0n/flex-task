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

    speakerPS: computed('speaker', function() {
        const speaker = this.get('speaker');
        return speaker ? this.get('model.speakers').findBy('id', speaker) : null;
    }),

    bookPS: computed('book', function() {
        const book = this.get('book');
        return book ? this.get('model.books').findBy('id', book) : null;
    }),

    actions: {
        async deleteMeeting(meeting) {
            let cureentmeet = meeting; 
            let reportcache = [];
            let promisesarr = [];
            let meetarr = cureentmeet.get('reports').toArray();;
            meetarr.forEach(report => {
                reportcache.push(report);
                promisesarr.push(report.destroyRecord());
            });
            await RSVP.all(promisesarr);

            reportcache.forEach(report => {
                this.store.unloadRecord(report);
            })
            await meeting.destroyRecord();
            this.store.unloadRecord(meeting);
            // this.transitionToRoute('meeting');
        },
        setSpeaker(speaker) {
            this.set('speaker', speaker ? speaker.get('id') : '');
        },

        setBook(book) {
            this.set('book', book ? book.get('id') : '');
        },

        setDate(date) {
            this.set('date', date);
        },
        
        updatePage() {
            this.send("reloadModel");
        },

        clear() {
            this.set('book', '');
            this.set('speaker', '');
            this.set('date', '');
            this.send("reloadModel");
        }
    }
})