import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export class ScheduleRepository {
    async getById(id: number) {
        return prisma.schedule.findUnique({
            where: { id },
            include: { subjects: true }
        });
    }

    async create(data: { name: string }) {
        return prisma.schedule.create({
            data
        })
    }

    async addSubject(scheduleID: number, subjectID: number) {
        return prisma.schedule.update({
            where: { id: scheduleID },
            data: {
                subjects: {
                    connect: { id: subjectID }
                }
            },
            include: { subjects: true }
        })
    }

    async removeSubject(scheduleID: number, subjectID: number) {
        return prisma.schedule.update({
            where: { id: scheduleID },
            data: {
                subjects: {
                    disconnect: { id: subjectID }
                }
            },
            include: { subjects: true }
        })
    }
}