import { Subject } from './Subject'
import { User } from './User'

export class Schedule {
    constructor(
        public name: string,
        public user: User,
        public subjects: Subject[]
    ) {}
}