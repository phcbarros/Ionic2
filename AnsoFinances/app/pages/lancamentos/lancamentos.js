import { Page, NavController, Modal, Alert } from 'ionic-angular';
import { ModalLancamentosPage } from '../modal-lancamentos/modal-lancamentos';
import { DAOLancamentos } from '../../dao/dao-lancamentos';
import { ToastService } from '../../service/toast.service';
import { ModalService } from '../../service/modal.service';

@Page({
	templateUrl: 'build/pages/lancamentos/lancamentos.html',
	providers: [DAOLancamentos]
})
export class LancamentosPage {
	static get parameters() {
		return [[NavController], [DAOLancamentos], [ToastService], [ModalService]];
	}

	constructor(nav, dao, toastService, modalService) {
		this.nav = nav;
		this.dao = dao;
		this.lancamentos = [];
		this.toast = toastService;
		this.modal = modalService;
		this.getList();
	}

	getList() {
		this.dao.getList(
			(lancamentos) => this.lancamentos = lancamentos,
			(erro) => this.showToast(erro));
	}

	insert() {
		let modal = this.createModal();
	
		this.modal.onDismiss(modal, (data) => {
			this.dao.save(data, 
			(lancamento) => {
				this.lancamentos.push(lancamento);
				this.showToast('Lançamento adicionado com sucesso!');
			},
			(erro) => this.showToast(erro));
		});
		
		this.showModal(modal);
	}

	edit(lancamento) {
		let modal = this.createModal(lancamento);

		this.modal.onDismiss(modal, (data) => {
			this.dao.edit(data,
				(lancamento) => {
					this.showToast('Lançamento alterado com sucesso!');
				},
				(erro) => this.showToast(erro));
		});

		this.showModal(modal);
	}

	delete(lancamento) {
		let confirm = Alert.create({
			title: 'Excluir',
			body: `Deseja realmente excluir o lançamento ${lancamento.descricao}?`,
			buttons: [
				{
					text: 'Sim',
					handler: () => this.confirmDelete(lancamento)
				},
				{
					text: 'Não'
				}
			]
		});

		this.nav.present(confirm);
	}

	confirmDelete(lancamento) {
		this.dao.delete(lancamento,
			() => {
				let index = this.lancamentos.indexOf(lancamento);
				this.lancamentos.splice(index, 1);
				this.showToast('Lançamento excluído com sucesso!');
			},
			(erro) => this.showToast(erro));
	}

	statusPagamento(lancamento){
		return lancamento.pago ? 'Pago': 'Não pago';
	}
	
	lancamentoEntrada(lancamento) {
		return lancamento.entradaSaida === 'entrada';
	}

	createModal(parametro) {
		let modal = this.modal.create(ModalLancamentosPage, { parametro: parametro });
		return modal;
    }

    showModal(modal) {
        this.nav.present(modal);
    }

  	showToast(message) {
		this.toast.showShortBottom(message).subscribe((toast) => console.log(toast));
	}
}
