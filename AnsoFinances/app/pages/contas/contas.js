import { Page, Modal, NavController } from 'ionic-angular';
import { DAOContas } from '../../dao/dao-contas';
import { ModalContasPage } from '../modal-contas/modal-contas';

@Page({
    templateUrl: 'build/pages/contas/contas.html',
    providers: [DAOContas]
})

export class ContasPage {
    
    static get parameters() {
        return [[NavController], [DAOContas]]
    }
    
    constructor(nav, dao) {
        this.dao = dao;
        this.getList();
        this._nav = nav;    
    }
    
    
    getList() {
        this.dao.getList((data) => {
            this.contas = data;
        });
    }
    
    insert() {
        let modal = this.createModal();
        this.onModalDismiss(modal, (data) => {
            this.dao.save(data, (conta) => {
                this.contas.push(conta);
            })
        });
        this.showModal(modal);        
    }
    
    edit(conta){
        let modal = this.createModal(conta);
        this.onModalDismiss(modal, (data) => {
            this.dao.edit(data, (conta) => {
                
            });
        });
        this.showModal(modal);        
    }
    
    delete(conta) {
        this.dao.delete(conta, (data) => {
            let index = this.contas.indexOf(conta);
            this.contas.splice(index, 1);  
        });
    }
    
    createModal(parametro) {
        let modal = parametro 
            ? Modal.create(ModalContasPage, { parametro: parametro}) 
            : Modal.create(ModalContasPage);
        
        return modal;
    }
    
    showModal(modal) {
        this._nav.present(modal);
    }
    
    onModalDismiss(modal, cb) {
        modal.onDismiss(cb);
    }
}