import express from "express"
import logger from "./utils/logger"
import cors from "cors"
import routes from "./routes"
import connect from "./utils/connect"
import { deserializeUser } from "./middleware/deserializeUser"
import { errorHandler } from "./middleware/errorHandler"
import cookieParser from "cookie-parser"
import path from "path"

const PORT = process.env.PORT
const app = express()

app.use(cookieParser())
app.use(cors({ exposedHeaders: ["x-access-token", "CSRF-Token"], origin: "http://localhost:3000", methods: ["POST", "PUT", "DELETE"], credentials: true }))
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.json())
app.use(deserializeUser)

app.listen(PORT, async () => {
    await connect()
    console.log(path.join(__dirname, '../client/build'))
    logger.info(`Listening to port ${PORT}`)





    routes(app)
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
    app.use(errorHandler)
})

