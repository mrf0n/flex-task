import Service from '@ember/service';
import ENV from 'h-work-2/config/environment';
import { A } from '@ember/array';

export default Service.extend({
    init() {
        this._super(...arguments);
        this.set('books', A()); this.set('speakers', A()); this.set('tags', A());
    },

    // async get_books(search, tagslike) {
    //     var query='';
    //     if(search && tagslike){
    //         query = `?q=${search}&tags_like=${tagslike}`;
    //     }
    //     else if(search){
    //         query = `?q=${search}`;
    //     }
    //     else if(tagslike){
    //         query = `?tags_like=${tagslike}`;
    //     } 
    //     //получение из бд записей
    //     let books = await fetch(`${ENV.backendURL}/db_books${query}`).then((response) => response.json());
    //     //очищаем старые объекты без искомого значения
    //     this.get('books').clear();
    //     //добавляем с условием поиска
    //     this.get('books').pushObjects(books);
    //     return this.get('books');
    // },

    // async get_speakers(search) {
    //     var query='';
    //     if(search){
    //         query = `?q=${search}`;
    //     }
    //     //получение из бд записей
    //     let speakers = await fetch(`${ENV.backendURL}/speakers${query}`).then((response) => response.json());
    //     this.get('speakers').clear();
    //     this.get('speakers').pushObjects(speakers);
    //     return this.get('speakers');
    // },


    // get_book(id) {
    //     return this.get('books').find((book) => 
    //     book.id === parseInt(id));
    // },

    // get_speaker(id) {
    //     return this.get('speakers').find((speaker) => 
    //     speaker.id === parseInt(id));
    // },
    
    // delete_book(book) {
    //     this.get('books').removeObject(book);
    //     return fetch(`${ENV.backendURL}/db_books/${book.id}`, { method: 'DELETE'});
    // },

    // delete_speaker(speaker) {
    //     this.get('speakers').removeObject(speaker);
    //     return fetch(`${ENV.backendURL}/db_speakers/${speaker.id}`, { method: 'DELETE'});
    // },

    // create_book(book) {
    //     this.get('books').pushObject(book);
    //     return fetch(`${ENV.backendURL}/db_books`, {
    //         method: 'POST',
    //         body: JSON.stringify(book),
    //         headers: {
    //         'Content-Type': 'application/json'
    //         }
    //     });
    // },

    // create_speaker(speaker) {
    //     this.get('speakers').pushObject(speaker);
    //     return fetch(`${ENV.backendURL}/db_speakers`, {
    //         method: 'POST',
    //         body: JSON.stringify(speaker),
    //         headers: {
    //         'Content-Type': 'application/json'
    //         }
    //     });
    // },

    // async edit_book(book, uploadData) {
    //     this.get('books').removeObject(this.get('books').find((temp) => 
    //     temp.id === parseInt(book.id)));
    //     this.get('books').pushObject(book);
    //     if(uploadData) {
    //         uploadData.url = `${ENV.backendURL}/FileUpload`;
    //         uploadData.submit().done(async (result/*, textStatus, jqXhr*/) => {
    //             const dataToUpload = {
    //                 entityName: 'db_books',
    //                 id: book.id,
    //                 fileName: result.filename
    //             };

    //             await fetch(`${ENV.backendURL}/saveURL`, {
    //                 method: 'POST',
    //                 body: JSON.stringify(dataToUpload),
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 }
    //             });
    //         });
    //     }

    //     return await fetch(`${ENV.backendURL}/db_books/${book.id}`, { 
    //         method: 'PATCH',
    //         body: JSON.stringify(book),
    //         headers: {
    //         'Content-Type': 'application/json'
    //         }
    //     });
    // },

    // edit_speaker(speaker) {
    //     this.get('speakers').removeObject(this.get('speakers').find((temp) => 
    //     temp.id === parseInt(speaker.id)));
    //     this.get('speakers').pushObject(speaker);
    //     return fetch(`${ENV.backendURL}/db_speakers/${speaker.id}`, {
    //         method: 'PATCH',
    //         body: JSON.stringify(speaker),
    //         headers: {
    //         'Content-Type': 'application/json'
    //         }
    //     });
    // },
});

