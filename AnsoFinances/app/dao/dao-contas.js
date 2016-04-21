import { Injectable } from 'angular2/core';

export class DAOContas {
    constructor() {
        this.list = [];
    }
    
    getList() {
        this.list.push({ descricao: 'Transporte' });
        this.list.push({ descricao: 'Lazer' });
        this.list.push({ descricao: 'Saúde' });
        
        return this.list;
    }
    
    save(conta) {
        this.list.push(conta);
    }
    
    edit(conta) {
        
    }
    
    delete(conta) {
        let index = this.list.indexOf(conta);
        this.list.splice(index, 1);
    } 
}