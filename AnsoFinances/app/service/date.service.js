import { Injectable } from 'angular2/core';

@Injectable()
export class DateService {
    
    parseDate(date) {
        var arr = date.split('-');
        return new Date(arr[0], arr[1]-1, arr[2]);
    }
    
    parseString(date) {
        return new Date(date).toLocaleDateString();
    }
    
    formatDate(dateMiliseconds) {
        
        if(!dateMiliseconds) return;
        
        let data = new Date(dateMiliseconds);
        let inicio = '00';

        let ano = data.getFullYear();
        let mes = (inicio + ( data.getMonth() + 1)).slice(-inicio.length);
        let dia = (inicio + data.getDate()).slice(-inicio.length);

        return `${ano}-${mes}-${dia}`;
    }
    
    getMonthName(date) {
        let meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        
        return meses[date.getMonth()];
    }
    
    getFirstDay(date){
        let ano = date.getFullYear();
        let mes = date.getMonth();
        
        return new Date(ano, mes, 1);
    }
    
    getLastDay(date){
        let ano = date.getFullYear();
        let mes = date.getMonth() + 1;
        
        return new Date(ano, mes, 0);
    }
}