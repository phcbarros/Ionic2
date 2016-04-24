import { Page, Modal, NavController, Alert } from 'ionic-angular';
import { DAOContas } from '../../dao/dao-contas';
import { ModalContasPage } from '../modal-contas/modal-contas';
import { ToastService } from '../../service/toast.service';
import { provide } from 'angular2/core';

@Page({
    templateUrl: 'build/pages/contas/contas.html',
    providers: [provide(DAOContas, {useClass: DAOContas})]
})

export class ContasPage {
    static get parameters() {
        return [[NavController], [DAOContas], [ToastService]]
    }

    constructor(nav, dao, toastService) {
        this.dao = dao;
        this.nav = nav;
        this.toast = toastService;
        this.getList();
    }

    getList() {
        this.dao.getList(
            (data) => this.contas = data,
            (erro) => this.showToast(erro));
    }

    insert() {
        let modal = this.createModal();
        this.onModalDismiss(modal, (data) => {
            if (!data) return;
            this.dao.save(data, (conta) => {
                this.contas.push(conta);
                this.showToast('Conta adicionada com sucesso!');
            });
        }, 
        (erro) => this.showToast(erro));
        
        this.showModal(modal);
    }

    edit(conta) {
        //TODO bug alterar 
        let modal = this.createModal(conta);
        this.onModalDismiss(modal, (data) => {
            this.dao.edit(data, (conta) => {
                this.showToast('Conta alterada com sucesso!');
            });
        },  
        (erro) => this.showToast(erro));
        
        this.showModal(modal);
    }

    delete(conta) {
        let confirm = Alert.create({
            title: 'Excluir',
            body: `Deseja realmente excluir a conta ${conta.descricao}?`,
            buttons: [
                {
                    text: 'Sim',
                    handler: () => this.confirmDelete(conta)
                },
                {
                    text: 'Não'
                }
            ]
        });

        this.nav.present(confirm);
    }

    confirmDelete(conta) {
        this.dao.delete(conta, (data) => {
            let index = this.contas.indexOf(conta);
            this.contas.splice(index, 1);
            this.showToast('Conta excluída com sucesso!');
        }, 
        (erro) => this.showToast(erro));
    }

    createModal(parametro) {
        let modal = parametro
            ? Modal.create(ModalContasPage, { parametro: parametro })
            : Modal.create(ModalContasPage);

        return modal;
    }

    showModal(modal) {
        this.nav.present(modal);
    }

    onModalDismiss(modal, cb) {
        modal.onDismiss(cb);
    }

    showToast(message) {
        this.toast.showShortBottom(message).subscribe((toast) => console.log(toast));
    }
}