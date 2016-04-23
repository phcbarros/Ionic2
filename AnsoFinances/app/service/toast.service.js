import { Injectable } from 'angular2/core';
import { Toast } from 'ionic-native';

@Injectable()
export class ToastService {
    
    showShortBottom(message) {
        return Toast.showShortBottom(message);
    }
}