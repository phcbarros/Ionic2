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
    
    getList(dataInicio, dataFim, successCallback, errorCallback) {
        this.storage.query('SELECT id, descricao, valor, data, conta, entradaSaida, pago FROM lancamentos WHERE data BETWEEN ? AND ?',
            [dataInicio, dataFim])
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
            VALUES(?, ?, ?, ?, ?, ?)`, 
            [lancamento.descricao, lancamento.valor, lancamento.data, lancamento.conta, lancamento.entradaSaida, lancamento.pago])
            .then((data) => {
                lancamento.id = data.res.insertId;
                successCallback(lancamento);
                console.log('Gravou', lancamento);
            })
            .catch((error) => this.errorHandler('Erro na edição de dados de lancamentos', error, errorCallback));;
    }
    
    edit(lancamento, successCallBack, errorCallback) {
        this.storage.query(`UPDATE lancamentos SET descricao = ?, valor = ? , data = ?, conta = ?,
            entradaSaida = ?, pago = ? WHERE id = ? `, 
            [lancamento.descricao, lancamento.valor, lancamento.data, lancamento.conta, lancamento.entradaSaida, lancamento.pago, lancamento.id])
            .then((data) => successCallBack(lancamento))
            .catch((error) => this.errorHandler('Erro na edição de dados de lancamentos', error, errorCallback));
    }
    
    delete(lancamento, successCallback, errorCallback){
        this.storage.query('DELETE FROM lancamentos WHERE id = ?', [lancamento.id])
            .then((data) => {
               successCallback(lancamento); 
            })
            .catch((error) => this.errorHandler('Erro na exclusão de dados de lancamentos', error, errorCallback));
    }
    
    getSaldo(successCallback, errorCallback){
        this.storage.query(`
                SELECT TOTAL(valor) AS saldo, entradaSaida FROM lancamentos WHERE pago = 1 AND entradaSaida = 'entrada'
                UNION
                SELECT TOTAL(valor) AS saldo, entradaSaida FROM lancamentos WHERE pago = 1 AND entradaSaida = 'saida'
            `, [])
            .then((data) => {
                let saldo = 0;
                let l = data.res.rows.length;
                let rows = data.res.rows;
                
                for (let i = 0; l--; i++) {
                    let item = rows.item(i);
                    
                    if(item.entradaSaida === 'entrada')
                        saldo += item.saldo;
                    else
                        saldo -= item.saldo;     
                }
                
                successCallback(saldo);
            })
            .catch((error) => this.errorHandler('Erro ao recuperar o saldo dos lancamentos', error, errorCallback));
    }
    
    errorHandler(message, error, errorCallback){
        console.error(message, error);
        if(errorCallback) errorCallback(message);
    }
    
}