import { Response } from "express";
import { UserService } from "../src/services/UserService";
import { ScheduleService } from "../src/services/ScheduleService";
import { SubjectService } from "../src/services/SubjectService";
import { UserRepository } from "../src/infra/repositories/UserRepository"
import { ScheduleRepository } from "../src/infra/repositories/ScheduleRepository"
import { SubjectRepository } from "../src/infra/repositories/SubjectRepository"
import { AuthRequest } from "./authMiddleware"
import { generateToken } from "./authMiddleware";

const userRepo = new UserRepository()
const scheduleRepo = new ScheduleRepository()
const subjectRepo = new SubjectRepository()

const userService = new UserService(userRepo);
const scheduleService = new ScheduleService(scheduleRepo, subjectRepo, userRepo);
const subjectService = new SubjectService(subjectRepo);

//Converte mensagens de erro internas para mensagens para o usuário.
function formatError(err: Error) {
    const map: Record<string, string> = {
        "USERNAME_IN_USE":              "Esse username já está em uso.",
        "USER_NOT_FOUND":               "Usuário não encontrado.",
        "INCORRECT_PASSWORD":           "Senha incorreta.",
        "NOT_AUTHORIZED":               "Acesso negado.",
        "SCHEDULE_NAME_IN_USE":         "Esse nome já está em uso.",
        "SCHEDULE_NOT_FOUND":           "Grade não encontrada.",
        "SUBJECT_NOT_FOUND":            "Matéria não encontrada.",
        "SUBJECT_ALREADY_IN_SCHEDULE":  "Matéria já adicionada à grade.",
        "SUBJECT_NOT_IN_SCHEDULE":      "Matéria não encontrada na grade."
    }
    return map[err.message] || "Algo deu errado."
}

function isValidString(str: any) {
    return typeof str === "string" && str.trim().length > 0
}

export const UserController = {
    async register(req: AuthRequest, res: Response) {
        try {
            const { username, password } = req.body

            if(!isValidString(username)) {
                return res.status(400).json({ error: "Nome de usuário inválido." })
            }

            if(!isValidString(password)) {
                return res.status(400).json({ error: "Senha inválida." })
            }

            if(password.length < 6) {
                return res.status(400).json({ error: "Senha deve ter ao menos 6 caracteres." })
            }

            const user = await userService.register(username, password)
            res.json(user)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async login(req: AuthRequest, res: Response) {
        try {
            const { username, password } = req.body
            if(!username || !password) {
                return res.status(400).json({ error: "Insira o nome de usuário e senha." })
            }

            const user = await userService.login(username, password)

            const token = generateToken(user.id, user.isAdmin)

            const { password: _, ...userData } = user
            res.json({ userData, token })
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async deleteUser(req: AuthRequest, res: Response) {
        try {
            if (!req.user!.isAdmin) {
                return res.status(403).json({ error: "Acesso negado." })
            }

            const id = Number(req.params.id)
            if (isNaN(id)) {
                return res.status(400).json({ error: "ID inválido." })
            }

            const deleted = await userService.deleteUser(id)
            res.json(deleted)

        } catch (err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },


    async getMe(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id
            const user = await userService.getById(userId)

            if(!user) {
                return res.status(404).json({ error: "Usuário não encontrado." })
            }

            const { password: _, ...safeUser } = user
            res.json(safeUser)

        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },


    async updateUsername(req: AuthRequest, res: Response) {
        try {
            const targetUser = Number(req.params.id)
            const loggedUser = Number(req.user!.id)
            const isAdmin = req.user!.isAdmin
            const { newUsername } = req.body

            if(targetUser !== loggedUser && !isAdmin) {
                return res.status(403).json({ error: "Acesso negado." })
            }

            if(!isValidString(newUsername)) {
                return res.status(400).json({ error: "Nome de usuário inválido." })
            }

            const updatedUser = await userService.updateUsername(targetUser, newUsername)

            const { password, ...userData } = updatedUser
            res.json(userData)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async updatePassword(req: AuthRequest, res: Response) {
        try {
            const targetUser = Number(req.params.id)
            const loggedUser = Number(req.user!.id)
            const isAdmin = req.user!.isAdmin
            const { newPassword } = req.body

            if(targetUser !== loggedUser && !isAdmin) {
                return res.status(403).json({ error: "Acesso negado." })
            }

            if(!isValidString(newPassword)) {
                return res.status(400).json({ error: "Senha inválida." })
            }

            if(newPassword.length < 6) {
                return res.status(400).json({ error: "Senha deve ter ao menos 6 caracteres." })
            }

            const updatedUser = await userService.updatePassword(targetUser, newPassword)

            const { password, ...userData } = updatedUser
            res.json(userData)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async getAllUsers(req: AuthRequest, res: Response) {
        try {
            const adminId = req.user!.id
            const users = await userService.getAllUsers(adminId)

            const noPasswords = users.map(({ password, ...u }) => u)
            res.json(noPasswords)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    }
}

export const ScheduleController = {
    async createSchedule(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id
            const { scheduleName } = req.body

            if(!userId) {
                return res.status(400).json({ error: "Usuário não encontrado."})
            }

            if(!isValidString(scheduleName)) {
                return res.status(400).json({ error: "Nome inválido." })
            }

            const newSchedule = await scheduleService.createSchedule(userId, scheduleName)
            res.json(newSchedule)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async deleteSchedule(req: AuthRequest, res: Response) {
        try {
            const scheduleId = Number(req.params.id)
            const loggedUser = req.user!.id
            const isAdmin = req.user!.isAdmin

            if(isNaN(scheduleId)) {
                return res.status(400).json({ error: "ID da grade faltando." })
            }

            const scheduleOwner = (await scheduleService.getById(scheduleId)).userId
            if((loggedUser !== scheduleOwner) && !isAdmin) {
                return res.status(403).json({ error: "Acesso negado." })
            }

            const deletedSchedule = await scheduleService.deleteSchedule(scheduleId)
            res.json(deletedSchedule)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err)})
        }
    },

    async getById(req: AuthRequest, res: Response) {
        try {
            const scheduleId = Number(req.params.id)
            const loggedUser = req.user!.id
            const isAdmin = req.user!.isAdmin

            if(isNaN(scheduleId)) {
                return res.status(400).json({ error: "ID da grade faltando." })
            }

            const schedule = await scheduleService.getById(scheduleId)

            if(!schedule) {
                return res.status(404).json({ error: "Grade não encontrada." })
            }

            if((loggedUser !== schedule.userId) && !isAdmin) {
                return res.status(403).json({ error: "Acesso negado." })
            }

            res.json(schedule)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async getByUser(req: AuthRequest, res: Response) {
        try {
            const userId = Number(req.params.id)
            const loggedUser = req.user!.id
            const isAdmin = req.user!.isAdmin

            if(isNaN(userId)) {
                return res.status(400).json({ error: "ID do usuário faltando." })
            }

            if((loggedUser !== userId) && !isAdmin) {
                return res.status(403).json({ error: "Acesso negado." })
            }

            const schedules = await scheduleService.getByUser(userId)
            res.json(schedules)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async rename(req: AuthRequest, res: Response) {
        try {
            const loggedUser = req.user!.id
            const isAdmin = req.user!.isAdmin
            const scheduleId = Number(req.params.id)
            const { newName } = req.body

            if(isNaN(scheduleId)) {
                return res.status(400).json({ error: "ID da grade faltando." })
            }

            const schedule = await scheduleService.getById(scheduleId)
            if(!schedule) {
                return res.status(404).json({ error: "Grade não encontrada." })
            }

            if(!isValidString(newName)) {
                return res.status(400).json({ error: "Nome inválido." })
            }

            if((loggedUser !== schedule.userId) && !isAdmin) {
                return res.status(403).json({ error: "Acesso negado." })
            }

            if(schedule.name === newName) {
                return res.json(schedule)
            }

            const renamedSchedule = await scheduleService.rename(scheduleId, newName)
            res.json(renamedSchedule)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async addSubject(req: AuthRequest, res: Response) {
        try {
            const loggedUser = req.user!.id
            const scheduleId = Number(req.params.id)
            const { subjectId } = req.body

            if(isNaN(scheduleId)) {
                return res.status(400).json({ error: "ID da grade faltando." })
            }

            if(!subjectId || typeof subjectId !== "number") {
                return res.status(400).json({ error: "ID da matéria inválido." })
            }

            const schedule = await scheduleService.getById(scheduleId)
            if(!schedule) {
                return res.status(404).json({ error: "Grade não encontrada." })
            }

            if(schedule.userId !== loggedUser && !req.user!.isAdmin) {
                return res.status(403).json({ error: "Acesso negado." })
            }

            const updatedSchedule = await scheduleService.addSubject(scheduleId, subjectId)
            res.json(updatedSchedule)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    
    async removeSubject(req: AuthRequest, res: Response) {
        try {
            const loggedUser = req.user!.id
            const scheduleId = Number(req.params.id)
            const { subjectId } = req.body

            if(isNaN(scheduleId)) {
                return res.status(400).json({ error: "ID da grade faltando." })
            }

            if(!subjectId || typeof subjectId !== "number") {
                return res.status(400).json({ error: "ID da matéria inválido." })
            }

            const schedule = await scheduleService.getById(scheduleId)
            if(!schedule) {
                return res.status(404).json({ error: "Grade não encontrada." })
            }

            if(schedule.userId !== loggedUser && !req.user!.isAdmin) {
                return res.status(403).json({ error: "Acesso negado." })
            }

            const updatedSchedule = await scheduleService.removeSubject(scheduleId, subjectId)
            res.json(updatedSchedule)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    }
}

export const SubjectController = {
    async createSubject(req: AuthRequest, res: Response) {
        try {
            const isAdmin = req.user!.isAdmin

            if(!isAdmin) {
                return res.status(403).json({ error: "Acesso negado." })
            }

            const { name, professor, classes } = req.body

            if(!isValidString(name)) {
                return res.status(400).json({ error: "Nome inválido." })
            }

            if(!isValidString(professor)) {
                return res.status(400).json({ error: "Professor inválido." })
            }

            if(!Array.isArray(classes) || classes.length === 0) {
                return res.status(400).json({ error: "Lista de aulas inválida." })
            }

            for(const c of classes) {
                if(
                    typeof c.day !== "number" || c.day < 1 || c.day > 5 ||
                    typeof c.time !== "number" || c.time < 1 || c.time > 6 ||
                    typeof c.classroom !== "number" || isNaN(c.classroom)
                ) {
                    return res.status(400).json({ error: "Aulas em formato inválido." })
                }
            }

            const newSubject = await subjectService.createSubject(name, professor, classes)
            res.json(newSubject)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async updateSubject(req: AuthRequest, res: Response) {
        try {
            const isAdmin = req.user!.isAdmin
            const subjectId = Number(req.params.id)

            if(!isAdmin) {
                return res.status(403).json({ error: "Acesso negado." })
            }

            if(isNaN(subjectId)) {
                return res.status(400).json({ error: "ID da matéria inválido." })
            }

            const { name, professor, classes } = req.body

            if(!isValidString(name)) {
                return res.status(400).json({ error: "Nome inválido." })
            }

            if(!isValidString(professor)) {
                return res.status(400).json({ error: "Professor inválido." })
            }

            if(!Array.isArray(classes) || classes.length === 0) {
                return res.status(400).json({ error: "Lista de aulas inválida." })
            }

            for(const c of classes) {
                if(
                    typeof c.day !== "number" || c.day < 1 || c.day > 5 ||
                    typeof c.time !== "number" || c.time < 1 || c.time > 6 ||
                    typeof c.classroom !== "number" || isNaN(c.classroom)
                ) {
                    return res.status(400).json({ error: "Aulas em formato inválido." })
                }
            }

            const updatedSubject = await subjectService.updateSubject(subjectId, name, professor, classes)
            res.json(updatedSubject)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async deleteSubject(req: AuthRequest, res: Response) {
        try {
            const isAdmin = req.user!.isAdmin

            if(!isAdmin) {
                return res.status(403).json({ error: "Acesso negado." })
            }

            const subjectId = Number(req.params.id)
            if(isNaN(subjectId)) {
                return res.status(400).json({ error: "ID da matéria inválido." })
            }

            const deletedSubject = await subjectService.deleteSubject(subjectId)
            res.json(deletedSubject)
        } catch(err: any) {
            console.error("DELETE SUBJECT ERROR:", err);
            res.status(400).json({ error: formatError(err) })
        }
    },

    async getAll(req: AuthRequest, res: Response) {
        try {
            const subjects = await subjectService.getAll()
            res.json(subjects)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async getById(req: AuthRequest, res: Response) {
        try {
            const subjectId = Number(req.params.id)

            if(isNaN(subjectId)) {
                return res.status(400).json({ error: "ID da matéria inválido." })
            }

            const subject = await subjectService.getById(subjectId)
            res.json(subject)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async getByName(req: AuthRequest, res: Response) {
        try {
            const subjectName = req.params.name

            if(!isValidString(subjectName)) {
                return res.status(400).json({ error: "Nome inválido." })
            }

            const subject = await subjectService.getByName(subjectName!)
            res.json(subject)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async getByProfessor(req: AuthRequest, res: Response) {
        try {
            const professor = req.params.professor

            if(!isValidString(professor)) {
                return res.status(400).json({ error: "Professor inválido." })
            }

            const subject = await subjectService.getByProfessor(professor!)
            res.json(subject)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async getByDay(req: AuthRequest, res: Response) {
        try {
            const day = Number(req.params.day)

            if(isNaN(day) || day < 1 || day > 5) {
                return res.status(400).json({ error: "Dia inválido." })
            }

            const subjects = await subjectService.getByDay(day)
            res.json(subjects)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async getByTime(req: AuthRequest, res: Response) {
        try {
            const time = Number(req.params.time)

            if(isNaN(time) || time < 1 || time > 6) {
                return res.status(400).json({ error: "Horário inválido." })
            }

            const subjects = await subjectService.getByTime(time)
            res.json(subjects)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    },

    async getByClassroom(req: AuthRequest, res: Response) {
        try {
            const classroom = Number(req.params.classroom)

            if(isNaN(classroom)) {
                return res.status(400).json({ error: "Sala de aula inválida." })
            }

            const subjects = await subjectService.getByClassroom(classroom)
            res.json(subjects)
        } catch(err: any) {
            res.status(400).json({ error: formatError(err) })
        }
    }
}