import { Injectable } from 'angular2/core';
import { Conta } from '../model/conta';
import { SqlStorageService } from '../service/sql-storage.service';

@Injectable()
export class DAOContas {
    static get parameters() {
        return [[SqlStorageService]];
    }
    
    constructor(sqlStorage) {
        this.storage = sqlStorage.get();    
        this.storage.query(`CREATE TABLE IF NOT EXISTS contas(
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                descricao TEXT)`)
            .then((data) => console.log('Tabela criada contas'))
            .catch((error) => this.errorHandler('Erro na criação da tabela contas', error));
    }
    
    getList(successCallback, errorCallback) {
        this.storage.query("SELECT id, descricao FROM contas")
            .then((data) => {
                let contas = [];
                let i = 0;
                let length = data.res.rows.length;
                let rows = data.res.rows;
                
                for (; length--; i++) {
                    let contaDb = rows.item(i);
                    let conta = new Conta(contaDb.id, contaDb.descricao);
                    contas.push(conta);                     
                }
                
                successCallback(contas);
            })
            .catch((error) => this.errorHandler('Erro ao recuperar dos dados de contas', error, errorCallback));
    }
    
    save(conta, successCallback, errorCallback) {
        this.storage.query('INSERT INTO contas(descricao) VALUES (?)', [conta.descricao])
            .then((data) => {
                conta.id = data.res.insertId;
                successCallback(conta);
            })
            .catch((error) => this.errorHandler('Erro na inserção de dados de contas', error, errorCallback));
    }
    
    edit(conta, successCallback, errorCallback) {
        this.storage.query("UPDATE contas SET descricao = ? WHERE id = ?", [conta.descricao, conta.id])
            .then((data) => {
                successCallback(conta);
            })
            .catch((error) => this.errorHandler('Erro na edição de dados de contas', error, errorCallback));
    }
    
    delete(conta, successCallback, errorCallback) {
        this.storage.query("DELETE FROM contas WHERE id = ? ", [conta.id])
            .then((data) => {
                successCallback(conta);
            })
            .catch((error) => this.errorHandler('Erro na exclusão de dados de contas', error, errorCallback));
    } 
    
    errorHandler(message, error, errorCallback){
        console.error(message, error);
        if(errorCallback) errorCallback(message);
    }
}