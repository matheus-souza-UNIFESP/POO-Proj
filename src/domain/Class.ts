/*
    Informações da aula de tal matéria
*/

export class Class {
    constructor(
        public day: number,     //1: Segunda, 2: Terça, 3: Quarta, 4: Quinta, 5: Sexta
        public time: number,    //1: 8h, 2: 10h, 3: 13h30, 4: 15h30, 5: 19h, 6: 21h
        public classroom: number,
        public subjectId?: number,
        public id?: number
    ) {}

}