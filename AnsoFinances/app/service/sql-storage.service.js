import { Injectable } from 'angular2/core';
import { Storage, SqlStorage } from 'ionic-angular';

@Injectable()
export class SqlStorageService {
    constructor() {
        this.storage = new Storage(SqlStorage, { name: 'finances' });
    }
    
    get() {
        return this.storage;
    }
} 