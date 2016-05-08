import { Component, Input, Output, EventEmitter } from 'angular2/core';
import { IONIC_DIRECTIVES } from 'ionic-angular/config/directives';
import { DateService } from '../service/date.service';

@Component({
    selector: 'data-filter',
    directives: [IONIC_DIRECTIVES],
    inputs: ['startDate'],
    outputs: ['changeMonth'],
    template: `
        <ion-row>
            <ion-col width-10>
                <button favorite clear round (click)="previousMonth()">
                    <ion-icon name="arrow-dropleft-circle"></ion-icon>  
                </button>  
            </ion-col>  
            <ion-col width-80>
                <h4 favorite class="center">{{selectedMonth}}</h4>
            </ion-col>
            <ion-col width-10>
                <button favorite clear round (click)="nextMonth()">
                    <ion-icon name="arrow-dropright-circle"></ion-icon>  
                </button>
            </ion-col>
        </ion-row>
    `
})

export class DataFilterComponent {
    
    static get parameters(){
        return [[DateService]];
    }
    
    constructor(dateService) {
        this.dateService = dateService;
        this.changeMonth = new EventEmitter();
    }
    
    ngOnInit(){
        this._updateMonth();
    }
    
    ngOnChanges(changes) {
        this._updateMonth();
    }
    
    _updateMonth(){
        let monthName = this.dateService.getMonthName(this.startDate);
        let year = this.startDate.getFullYear();
        
        this.selectedMonth = `${monthName} - ${year}`;
        this._executeChangeMonth(this.startDate);
    }
    
    _executeChangeMonth(date) {
        this.changeMonth.next(date);
    }
    
    previousMonth(){
        this.startDate.setMonth(this.startDate.getMonth() - 1);
        this._updateMonth();
    }
        
    nextMonth(){
        this.startDate.setMonth(this.startDate.getMonth() + 1);
        this._updateMonth();
    }
}