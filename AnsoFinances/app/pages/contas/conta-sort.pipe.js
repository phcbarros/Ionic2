import { Pipe } from 'angular2/core';

@Pipe({
    name: 'contaSort'
})
export class ContaSortPipe {
    
    transform(value, args) {
        return value.sort((a, b) => {
            return a.descricao.localeCompare(b.descricao, { sensitive: 'accent' });
        });
    }
}