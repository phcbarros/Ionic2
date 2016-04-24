import { Page, NavController, ViewController } from 'ionic-angular';
import { DAOContas } from '../../dao/dao-contas';
import { Lancamento } from '../../model/lancamento';
import { ToastService } from '../../service/toast.service';

@Page({
  templateUrl: 'build/pages/modal-lancamentos/modal-lancamentos.html',
  providers: [DAOContas]
})

export class ModalLancamentosPage {
  static get parameters() {
    return [[NavController], [ViewController], [DAOContas], [ToastService]];
  }

  constructor(nav, view, daoContas, toast) {
    this.nav = nav;
    this.view = view;
    this.daoContas = daoContas;
    this.toast = toast;
    this.lancamento = new Lancamento();
    
    this.getContas();
  }
  
  getContas() {
    this.daoContas.getList((contas) => {
        this.contas = contas;
      }, (message) => {
        this.toast.showLongCenter(message).subscribe((toast) => console.log(toast));
    });
  }
  
  save() {
    this.view.dismiss(this.lancamento);
  }
  
  close() {
    this.view.dismiss()
  }
  
}
