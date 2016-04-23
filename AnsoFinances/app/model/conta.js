import { Injectable } from 'angular2/core';

@Injectable()
export class Conta {
    constructor(id, descricao) {
        this.id = id;
        this.descricao = descricao;
    }
}