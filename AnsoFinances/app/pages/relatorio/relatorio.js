import { Page, NavController, NavParams } from 'ionic-angular';
import { DAOLancamentos } from '../../dao/dao-lancamentos';
import { ToastService } from '../../service/toast.service';
import { DateService } from '../../service/date.service';

@Page({
  templateUrl: 'build/pages/relatorio/relatorio.html',
  providers: [DAOLancamentos]
})
export class RelatorioPage {
  static get parameters() {
    return [[NavController], [NavParams], [DAOLancamentos], [ToastService], [DateService]];
  }

  constructor(nav, params, dao, toast, dateService) {
    this.nav = nav;
    this.params = params;
    this.dao = dao;
    this.toast = toast;
    this.dateService = dateService;
  }
  
  ngOnInit() {
    this.entradaSaida = 'entrada';
    this.contas = [];
    this.dataFiltro = this.params.get('dataFiltro');
    
    this.getListGroupByConta(this.dataFiltro, this.entradaSaida);        
  }
  
  getListGroupByConta(dataFiltro, entradaSaida){
    let dataInicio = this.dateService.getFirstDay(dataFiltro);
    let dataFim = this.dateService.getLastDay(dataFiltro);
    
    this.dao.getListGroupByConta(
      dataInicio, dataFim, entradaSaida, 
      (contas) => {
        this.contas = contas;
        this._calcularPercentagem(this.contas); 
      },
      (error) => this.toast.showShortBottom(error).subscribe((toast) => console.log(toast))
      );
  }
  
  onSelect(entradaSaida) {
    this.entradaSaida = entradaSaida;
    this.getListGroupByConta(this.dataFiltro, this.entradaSaida);
  }
  
  _calcularTotal(contas){
    let total = contas
      .map((value) => value.saldo)
      .reduce((previousValue, currentValue) => previousValue + currentValue);
      
    return total;
  }
  
  _calcularPercentagem(contas) {
    let total = this._calcularTotal(contas);
    contas.forEach((value) =>  value.percentual = (value.saldo / total ) * 100);
  }
       
}
