// web/authMiddleware.ts
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export interface AuthRequest extends Request {
    user?: { id: number, isAdmin: boolean }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: "NO_TOKEN" })

    const token = authHeader.split(" ")[1]
    if (!token) return res.status(401).json({ error: "NO_TOKEN" })

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { id: number, isAdmin: boolean }
        req.user = { id: payload.id, isAdmin: payload.isAdmin }
        next()
    } catch(err) {
        return res.status(401).json({ error: "INVALID_TOKEN" })
    }
}

export function generateToken(user: { id: number, isAdmin: boolean }) {
    return jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: "1h" }
    )
}
