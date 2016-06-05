import { Pipe } from 'angular2/core';

@Pipe({
    name: 'lancamentoFilter'
})
export class LancamentoFilterPipe {
    
    transform(value, args) {
        let filter = args[0] ? args[0].toLocaleLowerCase() : null;
        return filter ? value.filter((lancamento) => 
            lancamento.descricao.toLocaleLowerCase().indexOf(filter) !== -1) : value;
    }
    
}