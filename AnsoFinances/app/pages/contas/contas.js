import { Page, Modal, NavController, Alert } from 'ionic-angular';
import { DAOContas } from '../../dao/dao-contas';
import { ModalContasPage } from '../modal-contas/modal-contas';
import { ToastService } from '../../service/toast.service';
import { ModalService } from '../../service/modal.service';
import { provide } from 'angular2/core';
import { ContaSortPipe } from './conta-sort.pipe';

@Page({
    templateUrl: 'build/pages/contas/contas.html',
    providers: [provide(DAOContas, { useClass: DAOContas })],
    pipes: [ContaSortPipe]
})
export class ContasPage {
    static get parameters() {
        return [[NavController], [DAOContas], [ToastService], [ModalService]]
    }

    constructor(nav, dao, toastService, modalService) {
        this.dao = dao;
        this.nav = nav;
        this.toastService = toastService;
        this.modalService = modalService;
    }
    
    ngOnInit(){
        this.contas = [];
        this.getList();
    }

    getList() {
        this.dao.getList(
            (data) => this.contas = data,
            (erro) => this.showToast(erro));
    }

    insert() {
        let modal = this.createModal();
        
        this.modalService.onDismiss(modal,
            (data) => {
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
 
        this.modalService.onDismiss(modal,
            (data) => {
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
        this.dao.delete(conta,
            (data) => {
                let index = this.contas.indexOf(conta);
                this.contas.splice(index, 1);
                this.showToast('Conta excluída com sucesso!');
            },
            (erro) => this.showToast(erro));
    }

    createModal(parametro) {
        let modal = this.modalService.create(ModalContasPage, { parametro: parametro });
        return modal;
    }

    showModal(modal) {
        this.nav.present(modal);
    }

    showToast(message) {
        this.toastService.showShortBottom(message).subscribe((toast) => console.log(toast));
    }
}