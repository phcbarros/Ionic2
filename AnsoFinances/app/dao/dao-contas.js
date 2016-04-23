import { Injectable } from 'angular2/core';
import { Storage, SqlStorage} from 'ionic-angular';
import { Conta } from '../model/conta';
import { SqlStorageService } from '../service/sql-storage.service';

@Injectable()
export class DAOContas {
    
    static get parameters() {
        return [[SqlStorageService]];
    }
    
    constructor(sqlStorage) {
        this.storage = sqlStorage.get();    
        this.storage.query('CREATE TABLE IF NOT EXISTS contas(id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT)')
            .then((data) => console.log('Tabela criada'))
            .catch((error) => this.errorHandler('Erro na criação da tabela', error));
    }
    
    getList(successCallback) {
        this.storage.query("SELECT id, descricao FROM contas")
            .then((data) => {
                let list = [];
                let i = 0;
                let length = data.res.rows.length;
                let rows = data.res.rows;
                
                for (; length--; i++) {
                    let id = rows.item(i).id;
                    let descricao = rows.item(i).descricao;
                    let item = new Conta(id, descricao);
                                       
                    list.push(item);                     
                }
                
                successCallback(list);
            })
            .catch((error) => this.errorHandler('Erro ao recuperar dos dados', error));
    }
    
    save(conta, successCallback) {
        this.storage.query('INSERT INTO contas(descricao) VALUES (?)', [conta.descricao])
            .then((data) => {
                conta.id = data.res.insertId;
                successCallback(conta);
            })
            .catch((error) => this.errorHandler('Erro na inserção de dados', error));
    }
    
    edit(conta, successCallback) {
        this.storage.query("UPDATE contas SET descricao = ? WHERE id = ?", [conta.descricao, conta.id])
            .then((data) => {
                successCallback(conta);
            })
            .catch((error) => this.errorHandler('Erro na edição de dados', error));
    }
    
    delete(conta, successCallback) {
        this.storage.query("DELETE FROM contas WHERE id = ? ", [conta.id])
            .then((data) => {
                successCallback(conta);
            })
            .catch((error) => this.errorHandler('Erro na exclusão de dados', error));
    } 
    
    errorHandler(message, error){
        console.error(message, error);
    }
}