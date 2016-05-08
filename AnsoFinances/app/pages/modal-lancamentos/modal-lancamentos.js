import { Page, NavController, ViewController, NavParams } from 'ionic-angular';
import { DAOContas } from '../../dao/dao-contas';
import { Lancamento } from '../../model/lancamento';
import { ToastService } from '../../service/toast.service';
import { DateService } from '../../service/date.service';

@Page({
  templateUrl: 'build/pages/modal-lancamentos/modal-lancamentos.html',
  providers: [DAOContas]
})

export class ModalLancamentosPage {
  static get parameters() {
    return [[NavController], [ViewController], [NavParams], [DAOContas], [ToastService], [DateService]];
  }

  constructor(nav, view, params, daoContas, toast, date) {
    this.nav = nav;
    this.view = view;
    this.daoContas = daoContas;
    this.toast = toast;
    this.dateService = date;
    this.lancamento = params.get('parametro') || new Lancamento();
    
    this.descricao = this.lancamento.descricao;
    this.valor = this.lancamento.valor;
    this.data = this._getDate(this.lancamento.data);
    this.entradaSaida = this.lancamento.entradaSaida;
    this.conta = this.lancamento.conta;
    this.pago = this.lancamento.pago;
    
    this.getContas();
  }
  
  getContas() {
    this.daoContas.getList(
      (contas) => {
        this.contas = contas;
      }, 
      (error) => {
        this.toast.showLongCenter(error).subscribe((toast) => console.log(toast));
    });
  }
  
  save() {
    let data = this.dateService.parseDate(this.data);
    
    this.lancamento.descricao = this.descricao;
    this.lancamento.valor = parseFloat(this.valor);
    this.lancamento.data = data.getTime();
    this.lancamento.entradaSaida = this.entradaSaida;
    this.lancamento.conta = this.conta;
    this.lancamento.pago = this.pago ? 1 : 0;
    
    this.view.dismiss(this.lancamento);
  }
  
  close() {
    this.view.dismiss();
  }
  
  _getDate(date) {
      let dataFormatada =  this.dateService.formatDate(date);
      
      return dataFormatada;
  }
  
}
