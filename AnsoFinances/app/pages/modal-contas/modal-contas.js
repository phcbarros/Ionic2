import { Page, ViewController, NavParams } from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/modal-contas/modal-contas.html',
})

export class ModalContasPage {
  
  static get parameters() {
    return [[ViewController], [NavParams]];
  }
  
  constructor(view, params) {
    this._view = view;
    
    this.conta = params.get('parametro') || { descricao: '' };
  }
  
  close() {
    this._view.dismiss(); 
  }
  
  save(conta) {
    this._view.dismiss(conta);
  }
}
