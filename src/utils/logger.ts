import dayjs from "dayjs";
import pino from "pino";
import logger from "pino"

const transport = pino.transport({
    target: "pino-pretty",
    options: { colorize: true }
})

const log = logger({
    base: {
        pid: false
    },
    timestamp: () => `,"time":"${dayjs().format()}"`
}, transport)

export default log