import { Class } from './Class'

/*
    Classe com as informações das matérias
*/

export class Subject {
    constructor(
        public name: string,
        public professor: string,
        public classes: Class[] = [],
        public id?: number
    ) {}
}