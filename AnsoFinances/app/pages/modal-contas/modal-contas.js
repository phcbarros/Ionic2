import { Page, ViewController, NavParams } from 'ionic-angular';
import { Conta } from '../../model/conta';

@Page({
  templateUrl: 'build/pages/modal-contas/modal-contas.html'
})

export class ModalContasPage {
  
  static get parameters() {
    return [[ViewController], [NavParams]];
  }
  
  constructor(view, params, conta) {
    this._view = view;
    this.conta = params.get('parametro') || new Conta();
  }
  
  close() {
    this._view.dismiss(); 
  }
  
  save() {
    this._view.dismiss(this.conta);
  }
}
