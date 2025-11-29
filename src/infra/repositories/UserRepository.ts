import prisma from "../prisma/client"

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
    async create(username: string, hashedPassword: string) {
        return await prisma.user.create({
            data: { username, password: hashedPassword },
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
    async updateUsername(id: number, newUsername: string) {
        return await prisma.user.update({
            where: { id },
            data: { username: newUsername}
        })
    }

    //Altera a senha de um usuário existente
    async updatePassword(id: number, hashedPassword: string) {
        return await prisma.user.update({
            where: { id },
            data: { password: hashedPassword}
        })
    }
}