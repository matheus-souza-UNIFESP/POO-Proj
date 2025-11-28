import prisma from "../prisma/client"

export class ScheduleRepository {
    async getById(id: number) {
        return prisma.schedule.findUnique({
            where: { id },
            include: { subjects: true }
        });
    }

    async getByUserId(userId: number) {
        return prisma.schedule.findMany({
            where: { userId },
            include: { subjects: true }
        })
    }

    async create(name: string, userId: number) {
        return prisma.schedule.create({
            data: { name, userId },
            include: { subjects: true }
        })
    }

    async delete(id: number) {
        return prisma.schedule.delete({
            where: { id }
        })
    }

    async rename(id: number, newName: string) {
        return prisma.schedule.update({
            where: { id },
            data: { name: newName }
        })
    }

    async addSubject(scheduleId: number, subjectId: number) {
        return prisma.schedule.update({
            where: { id: scheduleId },
            data: {
                subjects: {
                    connect: { id: subjectId }
                }
            },
            include: { subjects: true }
        })
    }

    async removeSubject(scheduleId: number, subjectId: number) {
        return prisma.schedule.update({
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