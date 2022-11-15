import Component from '@ember/component';
import $ from 'jquery';
import { inject as service } from '@ember/service';

export default Component.extend({
    didInsertElement() {
        this._super(...arguments);
            $('.datepicker').datepicker({
                clearBtn: true,
                format: "yyyy-mm-dd",
                language: "ru",
                autoclose: true	
            });
        },
   
        actions: {
            changeDate(date) {
                try
                {this.changeDate(date);}
                catch(e){
                    let newLog = this.get('store').createRecord('log', 
                  {currentDate: new Date().toString(),
                  message: e.message,
                  currentURL: window.location.href,
                  ipAdress: '',})
                newLog.save();
                this.send('error', e);
                }
            }
        }
    });
