import config from "config"
import mongoose from "mongoose"

const connect = async () => {
    const dbUri = config.get<string>("db")
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(dbUri)
        console.log("Connected to MongoDB")

    } catch (error) {
        console.error("Problems connecting to MongoDB")
        process.exit(1)
    }
}

export default connect