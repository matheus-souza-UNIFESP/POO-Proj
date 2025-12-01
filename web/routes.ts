import { Router } from "express"
import { UserController } from "./controllers"
import { ScheduleController } from "./controllers"
import { SubjectController } from "./controllers"
import { authMiddleware } from "./authMiddleware"

const router = Router()

// -------------------- ROTAS DE USUÁRIO -------------------- //
router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/users/me", authMiddleware, UserController.getMe)
router.put("/users/:id/username", authMiddleware, UserController.updateUsername)
router.put("/users/:id/password", authMiddleware, UserController.updatePassword)

//ADMIN
router.delete("/users/:id", authMiddleware, UserController.deleteUser)

// -------------------- ROTAS DE MATÉRIA -------------------- //
router.get("/subjects", SubjectController.getAll)
router.get("/subjects/:id", SubjectController.getById)
router.get("/subjects/name/:name", SubjectController.getByName)
router.get("/subjects/professor/:professor", SubjectController.getByProfessor)
router.get("/subjects/day/:day", SubjectController.getByDay)
router.get("/subjects/time/:time", SubjectController.getByTime)
router.get("/subjects/classroom/:classroom", SubjectController.getByClassroom)

//ADMIN
router.post("/subjects", authMiddleware, SubjectController.createSubject)
router.put("/subjects/:id", authMiddleware, SubjectController.updateSubject)
router.delete("/subjects/:id", authMiddleware, SubjectController.deleteSubject)

// -------------------- ROTAS DE GRADES -------------------- //
router.post("/schedules", authMiddleware, ScheduleController.createSchedule)
router.get("/schedules/:id", authMiddleware, ScheduleController.getById)
router.get("/schedules/user/:id", authMiddleware, ScheduleController.getByUser)
router.put("/schedules/:id/rename", authMiddleware, ScheduleController.rename)
router.post("/schedules/:id/add-subject", authMiddleware, ScheduleController.addSubject)
router.post("/schedules/:id/remove-subject", authMiddleware, ScheduleController.removeSubject)

export default router