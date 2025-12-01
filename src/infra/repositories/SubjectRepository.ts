import { Subject } from "../../domain/Subject"
import prisma from "../prisma/client"

/*  
    Repositório responsável por todas
    operações do banco de dados envolvendo
    as matérias
*/

export class SubjectRepository {

    //Retorna todas as matérias no BD
    async getAll() {
        return await prisma.subject.findMany({
            include: { classes: true }
        })
    }

    //Retorna uma matéria pelo ID
    async getById(id: number) {
        return await prisma.subject.findUnique({
            where: { id },
            include: { classes: true }
        })
    }
    
    //Retorna uma matéria pelo nome
    async getByName(name: string) {
        return await prisma.subject.findFirst({
            where: { name },
            include: { classes: true }
        })
    }

    //Retorna todas as matérias ministrados pelo professor
    async getByProfessor(professor: string) {
        return await prisma.subject.findMany({
            where: { professor },
            include: { classes: true }
        })
    }

    //Retorna todas as matérias com aula no dia
    async getByDay(day: number) {
        return await prisma.subject.findMany({
            where: { 
                classes: {
                    some: { day }
                }
            },
            include: { classes: true }
        })
    }

    //Retorna todas as matérias com aula no horário
    async getByTime(time: number) {
        return await prisma.subject.findMany({
            where: { 
                classes: {
                    some: { time }
                }
            },
            include: { classes: true }
        })
    }

    //Retorna todas as matérias com aula na sala
    async getByClassroom(classroom: number) {
        return await prisma.subject.findMany({
            where: { 
                classes: {
                    some: { classroom }
                }
            },
            include: { classes: true }
        })
    }

    //Cria uma nova matéria
    async create(subject: Subject) {
        return await prisma.subject.create({
            data: {
                name: subject.name,
                professor: subject.professor,
                classes: {
                    create: subject.classes
                }
            },
            include: { classes: true }
        })
    }

    async update(subject: Subject) {
        await prisma.class.deleteMany({
            where: { subjectId: subject.id! }
        })

        return await prisma.subject.update({
            where: { id: subject.id },
            data: {
                name: subject.name,
                professor: subject.professor,
                classes: {
                    create: subject.classes.map(c => ({
                        day: c.day,
                        time: c.time,
                        classroom: c.classroom
                    }))
                }
            },
            include: { classes: true }
        })
    }

    //Deleta permanentemente uma matéria
    async delete(id: number) {
        const schedulesWithSubject = await prisma.schedule.findMany({
            where: {
                subjects: {
                    some: { id }
                }
            },
            select: { id: true }
        })

        for(const s of schedulesWithSubject) {
            await prisma.schedule.update({
                where: { id: s.id },
                data: {
                    subjects: {
                        disconnect: { id }
                    }
                }
            })
        }

        await prisma.class.deleteMany({
            where: { subjectId: id }
        })

        return await prisma.subject.delete({
            where: { id },
            include: { classes: true}
        })
    }
}