import { SubjectRepository } from "../infra/repositories/SubjectRepository"
import { Subject } from "../domain/Subject"

export class SubjectService {
    private subjectRepo: SubjectRepository

    constructor(subjectRepo: SubjectRepository) {
        this.subjectRepo = subjectRepo
    }

    //Cria uma nova matéria
    async createSubject(name: string, professor: string, classes: { day: number, time: number, classroom: number }[]) {
        const exists = await this.subjectRepo.getByName(name)
        if(exists) throw new Error("SUBJECT_ALREADY_EXISTS")

        const newSubject = new Subject(name, professor, classes)

        return await this.subjectRepo.create(newSubject)
    }

    //Modifica uma matéria
    async updateSubject(id: number, name: string, professor: string, classes: { day: number, time: number, classroom: number }[]) {
        const exists = await this.subjectRepo.getById(id)
        if(!exists) throw new Error("SUBJECT_NOT_FOUND")

        const subject = new Subject(name, professor, classes)
        subject.id = id

        return await this.subjectRepo.update(subject)
    }

    //Deleta uma matéria
    async deleteSubject(id: number) {
        const exists = await this.subjectRepo.getById(id)
        if(!exists) throw new Error("SUBJECT_NOT_FOUND")
        
        return await this.subjectRepo.delete(id)
    }

    //Lista todas as matérias
    async getAll() {
        return await this.subjectRepo.getAll()
    }

    //Busca matéria por ID
    async getById(id: number) {
        const subject = await this.subjectRepo.getById(id)
        if(!subject) throw new Error("SUBJECT_NOT_FOUND")

        return subject
    }

    //Busca matéria pelo nome
    async getByName(name: string) {
        const subject = await this.subjectRepo.getByName(name)
        if(!subject) throw new Error("SUBJECT_NOT_FOUND")

        return subject
    }

    //Busca matérias pelo professor
    async getByProfessor(professor: string) {
        const subject = await this.subjectRepo.getByProfessor(professor)
        return subject
    }

    //Busca matérias pelo dia
    async getByDay(day: number) {
        const subject = await this.subjectRepo.getByDay(day)
        return subject
    }

    //Busca matérias pela hora
    async getByTime(time: number) {
        const subject = await this.subjectRepo.getByTime(time)
        return subject
    }

    async getByClassroom(classroom: number) {
        const subject = await this.subjectRepo.getByClassroom(classroom)
        return subject
    }
}