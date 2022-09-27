import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
    didInsertElement() {
        this._super(...arguments);
        // $(function () {
            $('.datepicker').datepicker({
                clearBtn: true,
                format: "yyyy-mm-dd",
                language: "ru",
                autoclose: true	
            });
        },
   
        actions: {
            changeDate(date) {
                this.changeDate(date);
            }
        }
    });
