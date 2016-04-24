import { Page, NavController, Modal } from 'ionic-angular';
import { ModalLancamentosPage } from '../modal-lancamentos/modal-lancamentos';
import { DAOLancamentos } from '../../dao/dao-lancamentos';

@Page({
  templateUrl: 'build/pages/lancamentos/lancamentos.html',
  providers: [DAOLancamentos]
})
export class LancamentosPage {
  static get parameters() {
    return [[NavController], [DAOLancamentos]];
  }

  constructor(nav, dao) {
    this.nav = nav;
    this.dao = dao;
    this.lancamentos = [];
  }
  
  getList() {
    this.dao.getList((lancamentos) => this.lancamentos = lancamentos);
  }
  
  insert() {
    let modal = Modal.create(ModalLancamentosPage);
    
    modal.onDismiss((data) => {
      this.dao.save(data, (lancamento) => {
        this.lancamentos.push(lancamento);
      });
    })
    this.nav.present(modal);
  }
}
