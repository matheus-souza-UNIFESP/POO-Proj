import prisma from "../prisma/client"
import { Schedule } from "../../domain/Schedule"

/*  
    Repositório responsável por todas
    operações do banco de dados envolvendo
    as grades horárias
*/

export class ScheduleRepository {

    //Busca uma única grade pelo seu ID
    //Retorna null se não existe
    async getById(id: number) {
        return await prisma.schedule.findUnique({
            where: { id },
            include: { subjects: true }
        })
    }

    //Retorna todas as grades do usuário
    async getByUserId(userId: number) {
        return await prisma.schedule.findMany({
            where: { userId },
            include: { subjects: true }
        })
    }

    //Retorna uma grade pelo seu nome
    async getByName(userId: number, name: string) {
        return await prisma.schedule.findFirst({
            where: { userId, name },
            include: { subjects: true }
        })
    }

    //Cria uma nova grade para o usuário
    //Retorna a grade criada com a lista de matérias vazia
    async create(schedule: Schedule) {
        return await prisma.schedule.create({
            data: {
                name: schedule.name,
                userId: schedule.userID
            },
            include: { subjects: true }
        })
    }

    //Deleta permanentemente uma grade
    async delete(id: number) {
        return await prisma.schedule.delete({
            where: { id }
        })
    }

    //Atualiza o nome de uma grade existente
    async rename(schedule: Schedule) {
        return await prisma.schedule.update({
            where: { id: schedule.id },
            data: { name: schedule.name }
        })
    }

    //Adiciona uma matéria a uma grade
    //Usa connect pois a lista de matérias já existe
    async addSubject(scheduleId: number, subjectId: number) {
        return await prisma.schedule.update({
            where: { id: scheduleId },
            data: {
                subjects: {
                    connect: { id: subjectId }
                }
            },
            include: { subjects: true }
        })
    }

    //Remove uma matéria de uma grade
    //Não deleta a matéria
    async removeSubject(scheduleId: number, subjectId: number) {
        return await prisma.schedule.update({
            where: { id: scheduleId },
            data: {
                subjects: {
                    disconnect: { id: subjectId }
                }
            },
            include: { subjects: true }
        })
    }
}