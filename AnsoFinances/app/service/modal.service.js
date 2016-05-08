import { Injectable } from 'angular2/core';
import { Modal } from 'ionic-angular';

@Injectable()
export class ModalService {
    
    create(page, params) {
        let modal = params
            ? Modal.create(page, params)
            : Modal.create(page);

        return modal;
    }
    
    onDismiss(modal, cb) {
        modal.onDismiss(cb);
    }
}