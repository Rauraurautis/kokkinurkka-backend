import express from "express"
import config from "config"
import logger from "./utils/logger"
import cors from "cors"
import routes from "./routes"
import connect from "./utils/connect"
import { deserializeUser } from "./middleware/deserializeUser"
import { errorHandler } from "./middleware/errorHandler"
import csrf from "csurf"
import cookieParser from "cookie-parser"

const PORT = process.env.PORT
const app = express()

app.use(cookieParser())
app.use(cors({ exposedHeaders: ["x-access-token", "CSRF-Token"], origin: "http://localhost:3000", methods: ["POST", "PUT", "DELETE"], credentials: true }))


app.use(express.json())
app.use(deserializeUser)

app.listen(PORT, async () => {
    await connect()
    logger.info(`Listening to port ${PORT}`)
    routes(app)
    app.use(errorHandler)
})

