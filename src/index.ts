import express from "express"
import config from "config"
import logger from "./utils/logger"
import cors from "cors"
import routes from "./routes"
import connect from "./utils/connect"
import { deserializeUser } from "./middleware/deserializeUser"
import { errorHandler } from "./middleware/errorHandler"

const PORT = config.get("port")
const app = express()

app.use(cors({ exposedHeaders: "x-access-token" }))
app.use(express.json())
app.use(deserializeUser)

app.listen(PORT, async () => {
    logger.info(`Listening to port ${PORT}`)
    await connect()
    routes(app)
    app.use(errorHandler)
})

