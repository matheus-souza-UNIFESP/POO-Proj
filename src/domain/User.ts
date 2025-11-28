import { Schedule } from './Schedule'

/*
    Entidade do domínio representando um usuário
    NÃO se comunica com o banco de dados ou HTTP
*/

export class User {
    constructor(
        public id: number,
        public username: string,
        public password: string,
        public schedules: Schedule[] = []
    ) {}

    //Adiciona uma grade para a lista do usuário
    //NÃO atualiza o BD
    addSchedule(schedule: Schedule) {
        this.schedules.push(schedule);
    }

    //Deleta uma grade da lista do usuário
    removeSchedule(id: number) {
        this.schedules = this.schedules.filter(s => s.id !== id);
    }
}