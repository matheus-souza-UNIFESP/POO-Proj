import bcrypt from "bcrypt"
import { UserRepository } from "../infra/repositories/UserRepository"
import { User } from "../domain/User"

export class UserService {
    private userRepo: UserRepository
    private saltRounds = 10

    constructor(userRepo: UserRepository) {
        this.userRepo = userRepo
    }

    //Registrar usuário
    async register(username: string, password: string) {
        const existingUser = await this.userRepo.getByUsername(username)
        if(existingUser) throw new Error("USERNAME_IN_USE")

        const hashedPassword = await bcrypt.hash(password, this.saltRounds);
        const newUser = new User(username, hashedPassword)

        const createdUser = await this.userRepo.create(newUser)
        return createdUser
    }

    //Loga um usuário
    async login(username: string, password: string) {
        const user = await this.userRepo.getByUsername(username)
        if(!user) throw new Error("USER_NOT_FOUND")

        const isValid = await bcrypt.compare(password, user.password)
        if(!isValid) throw new Error("INCORRECT_PASSWORD")
        
        return user
    }

    //Deleta um usuário pelo seu ID
    async deleteUser(id: number) {
        const user = await this.userRepo.getById(id)
        if (!user) throw new Error("USER_NOT_FOUND")

        return await this.userRepo.delete(id)
    }

    //Busca um usuário pelo ID
    async getById(id: number) {
        const user = await this.userRepo.getById(id)
        if (!user) throw new Error("USER_NOT_FOUND")
        return user
    }


    //Atualiza o username
    async updateUsername(userId: number, newUsername: string) {
        const user = await this.userRepo.getById(userId)
        if(!user) throw new Error("USER_NOT_FOUND")
        
        if (user.username === newUsername) throw new Error("NO_CHANGE")
        
        const existingUser = await this.userRepo.getByUsername(newUsername)
        if(existingUser) throw new Error("USERNAME_IN_USE")
        
        user.username = newUsername

        return await this.userRepo.updateUsername(user)
    }

    //Atualiza a senha (ADMIN)
    async updatePassword(userId: number, newPassword: string) {        
        const user = await this.userRepo.getById(userId)
        if(!user) throw new Error("USER_NOT_FOUND")

        user.password = await bcrypt.hash(newPassword, this.saltRounds);
        
        return await this.userRepo.updatePassword(user)
    }

    //Lista todos os usuários (ADMIN)
    async getAllUsers(adminId: number) {
        const admin = await this.userRepo.getById(adminId)
        if(!admin || !admin.isAdmin) throw new Error("NOT_AUTHORIZED")

        return await this.userRepo.getAll();
    }

    //Lista todos os usuários e suas grades (ADMIN)
    async getAllUsersWithSchedules(adminId: number) {
        const admin = await this.userRepo.getById(adminId)
        if(!admin || !admin.isAdmin) throw new Error("NOT_AUTHORIZED")

        return await this.userRepo.getAllWithSchedules();
    }
}