import { Page, NavController, Modal, Alert, Events } from 'ionic-angular';
import { ModalLancamentosPage } from '../modal-lancamentos/modal-lancamentos';
import { RelatorioPage } from '../relatorio/relatorio';
import { DataFilterComponent } from '../../components/data-filter.component';
import { DAOLancamentos } from '../../dao/dao-lancamentos';
import { ToastService } from '../../service/toast.service';
import { ModalService } from '../../service/modal.service';
import { DateService } from '../../service/date.service';

@Page({
	templateUrl: 'build/pages/lancamentos/lancamentos.html',
	directives: [DataFilterComponent],
	providers: [DAOLancamentos]
})
export class LancamentosPage {
	static get parameters() {
		return [[NavController], [DAOLancamentos], [ToastService], [ModalService], [DateService], [Events]];
	}

	constructor(nav, dao, toastService, modalService, dateService, events) {
		this.nav = nav;
		this.dao = dao;
		this.toastService = toastService;
		this.modalService = modalService;
		this.dateService = dateService;
		this.events = events;
	}

	ngOnInit(){
		this.dataFiltro = new Date();
		this.lancamentos = [];
		this.onUpdateMonth(this.dataFiltro);
	}

	onUpdateMonth(date) {
		this.dataFiltro = date;
		let startDate = this.dateService.getFirstDay(date);
		let endDate = this.dateService.getLastDay(date);
		
		this.getList(startDate, endDate);
		this.updateSaldo();
	}
	
	onSelectMonth(dataFiltro){
		this.nav.push(RelatorioPage,  { dataFiltro: dataFiltro });
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
				this.onUpdateMonth(new Date(lancamento.data));
				this.showToast('Lançamento adicionado com sucesso!');
			},
			(erro) => this.showToast(erro));
		});
		
		this.showModal(modal);
	}

	edit(lancamento) {
		let modal = this.createModal(lancamento);

		this.modalService.onDismiss(modal, (data) => {
			this.updateLancamento(data);
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
				this.onUpdateMonth(new Date(lancamento.data));
				this.showToast('Lançamento excluído com sucesso!');
			},
			(erro) => this.showToast(erro));
	}

	updateSaldo(){
		this.dao.getSaldo((saldo) => {
			this.events.publish('saldo:updated', saldo);	
		});
	}
	
	updateLancamento(data){
		this.dao.edit(data,
				(lancamento) => {
					this.onUpdateMonth(new Date(lancamento.data));
					this.showToast('Lançamento alterado com sucesso!');
				},
				(erro) => this.showToast(erro));
	}
	
	paymentUpdateStatus(lancamento){
		lancamento.pago = lancamento.pago ? 0 : 1;
		this.updateLancamento(lancamento);
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
