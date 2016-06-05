import { Page, ViewController, NavParams } from 'ionic-angular';
import { Conta } from '../../model/conta';
import { provide } from 'angular2/core';

@Page({
  templateUrl: 'build/pages/modal-contas/modal-contas.html',
  providers: [provide(Conta, { useFactory: ()=> {
     return new Conta();
  }})]
})

export class ModalContasPage {
  static get parameters() {
    return [[ViewController], [NavParams], [Conta]];
  }
  
  constructor(view, params, conta) {
    this._view = view;
    this.params = params;
  }
  
  ngOnInit(){
    this.conta = this.params.get('parametro') || conta;
  }
  
  close() {
    this._view.dismiss(); 
  }
  
  save() {
    this._view.dismiss(this.conta);
  }
}
