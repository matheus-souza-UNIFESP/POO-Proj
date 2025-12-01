import express from "express"
import cors from "cors"
import router from "./routes"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api", router)

app.get("/", (req, res) => {
    res.send("Server está funcionando :)")
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`)
})