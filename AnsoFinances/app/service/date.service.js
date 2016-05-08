import { Injectable } from 'angular2/core';

@Injectable()
export class DateService {
    
    parseDate(date) {
        var arr = date.split('-');
        return new Date(arr[0], arr[1]-1, arr[2]);
    }
    
    formatDate(dateMiliseconds) {
        
        if(!dateMiliseconds) return;
        
        let data = new Date(dateMiliseconds);
        let inicio = "00";

        let ano = data.getFullYear();
        let mes = (inicio + ( data.getMonth() + 1)).slice(-inicio.length);
        let dia = (inicio + data.getDate()).slice(-inicio.length);

        return ano + "-" + mes + "-" + dia;
    }
}