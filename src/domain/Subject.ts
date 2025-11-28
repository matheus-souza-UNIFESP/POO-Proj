/*
    Classe com as informações das matérias
*/

export class Subject {
    constructor(
        public name: string,
        public professor: string,
        public daysOfWeek: number[],
        public time: number,
        public description?: string
    ) {}
}