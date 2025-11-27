import { Schedule } from './Schedule'

export class User {
    constructor(
        public id: number,
        public username: string,
        public password: string,
        public schedules: Schedule[] = []
    ) {}

    addSchedule(schedule: Schedule) {
        this.schedules.push(schedule);
    }

    removeSchedule(id: number) {
        this.schedules = this.schedules.filter(s => s.id !== id);
    }
}