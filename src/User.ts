import { Schedule } from './Schedule'

export class User {
    constructor(
        public id: number,
        public username: string,
        public password: string,
        public schedule: Schedule[]
    ) {}
}