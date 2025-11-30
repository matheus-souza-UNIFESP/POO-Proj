import { ScheduleRepository } from "../infra/repositories/ScheduleRepository";
import { SubjectRepository } from "../infra/repositories/SubjectRepository";
import { UserRepository } from "../infra/repositories/UserRepository";
import { Schedule } from "../domain/Schedule";

export class ScheduleService {
    private scheduleRepo: ScheduleRepository
    private subjectRepo: SubjectRepository
    private userRepo: UserRepository
    constructor(scheduleRepo: ScheduleRepository,subjectRepo: SubjectRepository, userRepo: UserRepository) {
        this.scheduleRepo = scheduleRepo
        this.subjectRepo = subjectRepo
        this.userRepo = userRepo
    }

    //Cria uma nova grade para o usuário
    async createSchedule(userId: number, scheduleName: string) {
        const user = await this.userRepo.getById(userId)
        if(!user) throw new Error("USER_NOT_FOUND")
    
        const usersSchedules = await this.scheduleRepo.getByUserId(userId)
        const nameInuse = usersSchedules.some(s => s.name === scheduleName)
        if(nameInuse) throw new Error("SCHEDULE_NAME_IN_USE")
    
        const newSchedule = new Schedule(scheduleName, userId)
    
        return await this.scheduleRepo.create(newSchedule)
    }
    
    //Deleta uma grade
    async deleteSchedule(id: number) {
        return await this.scheduleRepo.delete(id)
    }

    //Retorna uma grade pelo seu ID
    async getById(id: number) {
        const schedule = await this.scheduleRepo.getById(id)
        if(!schedule) throw new Error("SCHEDULE_NOT_FOUND")

        return schedule
    }

    //Retorna todas as grades do usuário
    async getByUser(userId: number) {
        const user = await this.userRepo.getById(userId)
        if(!user) throw new Error("USER_NOT_FOUND")

        return await this.scheduleRepo.getByUserId(userId)
    }

    //Renomeia uma grade
    async rename(id: number, newName: string) {
        const schedule = await this.scheduleRepo.getById(id)
        if(!schedule) throw new Error("SCHEDULE_NOT_FOUND")

        schedule.name = newName
        return await this.scheduleRepo.rename(schedule)
    }

    //Adiciona uma matéria a uma grade
    async addSubject(scheduleId: number, subjectId: number) {
        const schedule = await this.scheduleRepo.getById(scheduleId)
        if(!schedule) throw new Error("SCHEDULE_NOT_FOUND")

        if(!(await this.subjectRepo.getById(subjectId))) throw new Error("SUBJECT_NOT_FOUND")
        
        const alreadyIn = schedule.subjects.some(s => s.id === subjectId)
        if(alreadyIn) throw new Error("SUBJECT_ALREADY_IN_SCHEDULE")

        return await this.scheduleRepo.addSubject(scheduleId, subjectId)
    }

    //Remove uma matéria de uma grade
    async removeSubject(scheduleId: number, subjectId: number) {
        const schedule = await this.scheduleRepo.getById(scheduleId)
        if(!schedule) throw new Error("SCHEDULE_NOT_FOUND")

        if(!(await this.subjectRepo.getById(subjectId))) throw new Error("SUBJECT_NOT_FOUND")

        const subjectInSchedule = schedule.subjects.some(sub => sub.id === subjectId)
        if(!subjectInSchedule) throw new Error("SUBJECT_NOT_IN_SCHEDULE")

        return await this.scheduleRepo.removeSubject(scheduleId, subjectId)
    }
}