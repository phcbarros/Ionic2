import { Injectable } from 'angular2/core';
import { Lancamento } from '../model/lancamento';
import { SqlStorageService } from '../service/sql-storage.service';

@Injectable()
export class DAOLancamentos {
    static get parameters() {
        return [[SqlStorageService]]
    }
    
    constructor(sqlStorage) {
        this.storage = sqlStorage.get();
        this.storage.query(`CREATE TABLE IF NOT EXISTS lancamentos(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT,
            valor REAL,
            data INTEGER,
            conta TEXT,
            entradaSaida TEXT,
            pago INTEGER)`)
            .then((data) => console.log('Tabela criada lancamentos'))
            .catch((error) => this.errorHandler('Erro na criação da tabela lancamentos'));
    }
    
    getList(successCallback, errorCallback) {
        this.storage.query('SELECT id, descricao, valor, data, conta, entradaSaida, pago FROM lancamentos')
            .then((data) => {
                let lancamentos = [];
                let i = 0;
                let length = data.res.rows.length;
                let rows = data.res.rows;
                
                for(;length--; i++) {
                    let lancamentoDb = rows.item(i);
                    let lancamento = new Lancamento(lancamentoDb.id, lancamentoDb.descricao, lancamentoDb.valor, 
                        lancamentoDb.data, lancamentoDb.entradaSaida, lancamentoDb.conta, lancamentoDb.pago);
                    lancamentos.push(lancamento);
                }
                
                successCallback(lancamentos);
            })
            .catch((error) => this.errorHandler('Erro ao recuperar dos dados de contas', error, errorCallback));
    }
    
    save(lancamento, successCallback, errorCallback) {
        this.storage.query(`INSERT INTO lancamentos (descricao, valor, data, conta, entradaSaida, pago)
            VALUES(?, ?, ?, ?, ?, ?)`, [lancamento.descricao, lancamento.valor, lancamento.data, lancamento.conta, lancamento.entradaSaida, lancamento.pago])
            .then((data) => {
                lancamento.id = data.res.insertId;
                successCallback(lancamento);
                console.log('Gravou', lancamento);
            })
            .catch((error) => this.errorHandler('Erro na edição de dados de lancamentos', error, errorCallback));;
    }
    
    errorHandler(message, error, errorCallback){
        console.error(message, error);
        if(errorCallback) errorCallback(message);
    }
    
}