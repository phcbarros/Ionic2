import { Page, NavController, Modal, Alert } from 'ionic-angular';
import { ModalLancamentosPage } from '../modal-lancamentos/modal-lancamentos';
import { DAOLancamentos } from '../../dao/dao-lancamentos';
import { ToastService } from '../../service/toast.service';
import { ModalService } from '../../service/modal.service';
import { DateService } from '../../service/date.service';
import { DataFilterComponent } from '../../components/data-filter.component';

@Page({
	templateUrl: 'build/pages/lancamentos/lancamentos.html',
	directives: [DataFilterComponent],
	providers: [DAOLancamentos]
})
export class LancamentosPage {
	static get parameters() {
		return [[NavController], [DAOLancamentos], [ToastService], [ModalService], [DateService]];
	}

	constructor(nav, dao, toastService, modalService, dateService) {
		this.nav = nav;
		this.dao = dao;
		this.toastService = toastService;
		this.modalService = modalService;
		this.dateService = dateService;
		
		this.lancamentos = [];
		this.dataFiltro = new Date();
		
		this.updateMonth(this.dataFiltro);
	}

	updateMonth(date) {
		this.dataFiltro = date;
		let startDate = this.dateService.getFirstDay(date);
		let endDate = this.dateService.getLastDay(date	);
		
		this.getList(startDate, endDate);
	}
	
	getList(startDate, endDate) {	
		this.dao.getList(startDate.getTime(), endDate.getTime(),
			(lancamentos) => this.lancamentos = lancamentos,
			(erro) => this.showToast(erro));
	}

	insert() {
		let modal = this.createModal();
	
		this.modalService.onDismiss(modal, (data) => {
			this.dao.save(data, 
			(lancamento) => {
				this.updateMonth(new Date(lancamento.data));
				this.showToast('Lançamento adicionado com sucesso!');
			},
			(erro) => this.showToast(erro));
		});
		
		this.showModal(modal);
	}

	edit(lancamento) {
		let modal = this.createModal(lancamento);

		this.modalService.onDismiss(modal, (data) => {
			this.dao.edit(data,
				(lancamento) => {
					this.updateMonth(new Date(lancamento.data));
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

	getDate(date) {
		return this.dateService.parseString(date);
	}

	statusPagamento(lancamento){
		return lancamento.pago ? 'Pago': 'Não pago';
	}
	
	lancamentoEntrada(lancamento) {
		return lancamento.entradaSaida === 'entrada';
	}

	createModal(parametro) {
		let modal = this.modalService.create(ModalLancamentosPage, { parametro: parametro });
		return modal;
    }

    showModal(modal) {
        this.nav.present(modal);
    }

  	showToast(message) {
		this.toastService.showShortBottom(message).subscribe((toast) => console.log(toast));
	}
}
