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
        return await prisma.subject.findUnique({
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
    async create(data: Subject) {
        return await prisma.subject.create({
            data: {
                name: data.name,
                classes: {
                    create: data.classes
                }
            },
            include: { classes: true }
        })
    }

    async update(
        id: number, 
        updateData: { 
            name?: string,
            professor?: string,
            classes?: { day: number; time: number; classroom: number }[]
        }
    ) {
        return await prisma.subject.update({
            where: { id },
            data: {
                name: updateData.name,
                professor: updateData.professor,
                classes: updateData.classes
                    ? {
                        deleteMany: {},
                        create: updateData.classes
                    }
                    : undefined
            },
            include: { classes: true }
        })
    }

    //Deleta permanentemente uma matéria
    async delete(id: number) {
        return await prisma.subject.delete({
            where: { id }
        })
    }
}