import { Subject } from './Subject'

export class Schedule {
    constructor(
        public name: string,
        public user: number,
        public subjects: Subject[]
    ) {}
}