import { Pipe } from 'angular2/core';

@Pipe({
    name: 'lancamentoSort'
})
export class LancamentoSortPipe {
    
    transform(value, args) {

        let field = args[0];
        let fn;
        let localeConfig = { sensitive: 'accent', usage: 'sort' };
       
        switch (field) {
            case 'conta':
                fn = (a, b) => {
                    return a.conta.localeCompare(b.conta, localeConfig);
                };
            case 'data':
                fn = (a, b) => {
                    return a.data - b.data;
                };
                break;
            case 'valor': 
                fn = (a, b) => {
                    return a.valor - b.valor;
                };
                break;
            default:
                fn = (a, b) => {
                    return a.descricao.localeCompare(b.descricao, localeConfig);
                };
                break;
        }
            
        return value.sort(fn); 
    }
}