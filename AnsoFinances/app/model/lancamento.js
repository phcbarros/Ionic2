import { Injectable } from 'angular2/core';

@Injectable()
export class Lancamento {
    constructor(id, descricao, valor, data, entradaSaida, conta, pago) {
        this.id = id;
        this.descricao = descricao;
        this.valor = valor;
        this.data = data;
        this.entradaSaida = entradaSaida;
        this.conta = conta;
        this.pago = pago;
    }
}