import { Page, NavController, Events } from 'ionic-angular';
import { DAOLancamentos } from '../../dao/dao-lancamentos';
import { ToastService } from '../../service/toast.service';

@Page({
  templateUrl: 'build/pages/saldo/saldo.html',
  providers: [DAOLancamentos]
})
export class SaldoPage {
  static get parameters() {
    return [[NavController], [DAOLancamentos], [ToastService], [Events]];
  }

  constructor(nav, dao, toast, events) {
    this.nav = nav;
    this.dao = dao;
    this.toast = toast;
    this.events = events;
  }
  
  ngOnInit() {
      this.dao.getSaldo(
        (saldo) => this.saldo = saldo,
        (error) => {
          this.toastService.showShortBottom(error).subscribe((toast) => console.log(toast));
        });
        
      this.events.subscribe('saldo:updated', (saldo) => this.saldo = parseFloat(saldo));
  }
  
}
