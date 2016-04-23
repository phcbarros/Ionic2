import { Page, Modal, NavController, Alert } from 'ionic-angular';
import { DAOContas } from '../../dao/dao-contas';
import { ModalContasPage } from '../modal-contas/modal-contas';
import { ToastService } from '../../service/toast.service';

@Page({
    templateUrl: 'build/pages/contas/contas.html',
    providers: [DAOContas, ToastService]
})

export class ContasPage {

    static get parameters() {
        return [[NavController], [DAOContas], [ToastService]]
    }

    constructor(nav, dao, toastService) {
        this._dao = dao;
        this._nav = nav;
        this._toast = toastService;
        this.getList();
    }

    getList() {
        this._dao.getList((data) => {
            this.contas = data;
        });
    }

    insert() {
        let modal = this.createModal();
        this.onModalDismiss(modal, (data) => {
            if (!data) return;
            this._dao.save(data, (conta) => {
                this.contas.push(conta);
                this.showToast('Conta adicionada com sucesso!');
            });
        });
        this.showModal(modal);
    }

    edit(conta) {
        let modal = this.createModal(conta);
        this.onModalDismiss(modal, (data) => {
            this._dao.edit(data, (conta) => {
                this.showToast('Conta alterada com sucesso!');
            });
        });
        this.showModal(modal);
    }

    delete(conta) {
        let confirm = Alert.create({
            title: 'Excluir',
            body: `Deseja realmente excluir a conta ${conta.descricao}?`,
            buttons: [
                {
                    text: 'Sim',
                    handler: () => {
                        this.confirmDelete(conta);
                    }
                },
                {
                    text: 'Não'
                }
            ]
        });

        this._nav.present(confirm);
    }

    confirmDelete(conta) {
        this._dao.delete(conta, (data) => {
            let index = this.contas.indexOf(conta);
            this.contas.splice(index, 1);
            this.showToast('Conta excluída com sucesso!');
        });
    }

    createModal(parametro) {
        let modal = parametro
            ? Modal.create(ModalContasPage, { parametro: parametro })
            : Modal.create(ModalContasPage);

        return modal;
    }

    showModal(modal) {
        this._nav.present(modal);
    }

    onModalDismiss(modal, cb) {
        modal.onDismiss(cb);
    }

    showToast(message) {
        this._toast.showShortBottom(message).subscribe((toast) => console.log(toast));
    }
}