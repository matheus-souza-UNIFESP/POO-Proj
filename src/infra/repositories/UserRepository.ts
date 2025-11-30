import prisma from "../prisma/client"
import { User } from "../../domain/User"

/*  
    Repositório responsável por todas
    operações do banco de dados envolvendo
    os usuários
*/

export class UserRepository {

    //Busca o usuário pelo seu ID
    //Retorna null se não existe
    async getById(id: number) {
        return await prisma.user.findUnique({
            where: { id },
            include: { schedules: true }
        })
    }

    //Busca o usuário pelo seu username
    //Retorna null se não existe
    async getByUsername(username: string) {
        return await prisma.user.findUnique({
            where: { username },
            include: { schedules: true }
        })
    }

    //Retorna todos os usuários cadastrados
    //Para uso do admin
    async getAll() {
        return await prisma.user.findMany({
            include: { schedules: true }
        })
    }


    //Cria um novo usuário e retorna-o com a lista de grades vazia
    async create(user: User) {
        return await prisma.user.create({
            data: {
                username: user.username,
                password: user.password
            },
            include: { schedules: true }
        })
    }

    //Deleta permanentemente um usuário
    async delete(id: number) {
        return await prisma.user.delete({
            where: { id }
        })
    }

    //Altera o username de um usuário existente
    async updateUsername(user: User) {
        return await prisma.user.update({
            where: { id: user.id },
            data: { username: user.username }
        })
    }

    //Altera a senha de um usuário existente
    async updatePassword(user: User) {
        return await prisma.user.update({
            where: { id: user.id },
            data: { password: user.password }
        })
    }
}