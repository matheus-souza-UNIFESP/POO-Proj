import { Schedule } from './Schedule'
import { ScheduleRepository as ScheduleRepo} from '../repositories/ScheduleRepository'

export class User {
    constructor(
        public id: number,
        public username: string,
        public password: string,
        public schedules: Schedule[] = []
    ) {}

    async createSchedule(name: string) { //criar nova grade
        const schedule = new Schedule(name, this.id)
        const savedSchedule = await ScheduleRepo.create(schedule)  //TODO: implementar em schedulerepository
        this.schedules.push(savedSchedule)
        
        return savedSchedule
    }

    async deleteSchedule(id: number) { //deletar grade
        await ScheduleRepo.delete(id)  //TODO: implementar em schedulerepository
        this.schedules = this.schedules.filter(s => s.id !== id)
    }

    async loadSchedules() {
        this.schedules = await ScheduleRepo.getByUserId(this.id) //TODO: implementar em schedulerepository
    }

}