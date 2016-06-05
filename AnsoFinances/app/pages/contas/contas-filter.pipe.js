import { Pipe } from 'angular2/core';

@Pipe({
    name: 'contaFilter'
})
export class ContaFilterPipe {
    transform(value, args) {
        let filter = args[0] ? args[0].toLocaleLowerCase() : null;
        return filter ? value.filter((conta) => 
            conta.descricao.toLocaleLowerCase().indexOf(filter) !== -1) : value;
    }
}