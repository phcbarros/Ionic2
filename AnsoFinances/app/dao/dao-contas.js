import { Injectable } from 'angular2/core';
import { Storage, SqlStorage} from 'ionic-angular';
import { Conta } from '../model/conta';

@Injectable()
export class DAOContas {
    constructor() {
        let storage = this.createSqlStorate();
        
        storage.query('CREATE TABLE IF NOT EXISTS contas(id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT)')
            .then((data) => console.log('Tabela criada'))
            .catch((error) => errorHandler('Erro na criação da tabela', error));
    }
    
    getList(cb) {
        let storage = this.createSqlStorate();
              
        storage.query("SELECT id, descricao FROM contas")
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
                
                cb(list);
                                
            })
            .catch((error) => { this.errorHandler('Erro ao recuperar dos dados', error)});
    }
    
    save(conta, cb) {
        let storage = this.createSqlStorate();
       
        storage.query('INSERT INTO contas(descricao) VALUES (?)', [conta.descricao])
            .then((data) => {
                conta.id = data.res.insertId;
                cb(conta);
                console.log('Gravou', conta);
            })
            .catch((error) => this.errorHandler('Erro na inserção de dados', error));
    }
    
    edit(conta, cb) {
        let storage = this.createSqlStorate();
        
        storage.query("UPDATE contas SET descricao = ? WHERE id = ?", [conta.descricao, conta.id])
            .then((data) => {
                cb(conta);
                console.log('Editou', conta);
            })
            .catch((error) => this.errorHandler('Erro na edição de dados', error));
    }
    
    delete(conta, cb) {
        let storage = this.createSqlStorate();
        
        storage.query("DELETE FROM contas WHERE id = ? ", [conta.id])
            .then((data) => {
                cb(conta);
            })
            .catch((error) => this.errorHandler('Erro na exclusão de dados', error));
    } 
    
    createSqlStorate(){
        return new Storage(SqlStorage, { name: 'finances'});
    }
    
    errorHandler(message, error){
        console.log(message, error);
    }
}