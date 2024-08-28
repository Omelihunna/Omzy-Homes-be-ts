import MongoStore from "connect-mongo";
import mongoose, { ConnectOptions } from "mongoose";
import * as dotenv from "dotenv"
dotenv.config()

const MONGO_URL = process.env.MONGO_URL as string;

class DatabaseService {
    private mongoose;
    private readonly options: any;
    private mongoUrl: string

    constructor(MONGO_URL: string, options?: any) {
        this.options = options;
        this.mongoose = mongoose
        this.mongoUrl = MONGO_URL
    }

    connect() {
        this.mongoose.set('strictQuery', false);

        this.mongoose.connect(this.mongoUrl as string, this.options as ConnectOptions)

        this.mongoose.connection.once('connecting', () => {
            console.log('connecting to mongodb server via mongoose...')
        })
        this.mongoose.connection.once('connected', () => {
            console.log('connected to mongodb server via mongoose...')
        })
        this.mongoose.connection.once('open', () => {
            console.log('database is active...')
        })
        this.mongoose.connection.once('disconnecting', () => {
            console.log('disconnecting from mongodb server...')
        })
        this.mongoose.connection.once('disconnected', () => {
            console.log('disconnected from mongodb server...')
        })
        this.mongoose.connection.once('close', () => {
            console.log('closing connections with mongodb server...')
        })
        this.mongoose.connection.once('reconnected', () => {
            console.log('reconnected to mongodb server...')
        })
        this.mongoose.connection.once('error', (err) => {
            console.log('mongodb server error...')
            console.log(err)
        })
    }

    disconnect() {
        this.mongoose.disconnect()
            .then(() => {
                console.log('Successfully disconnected from db')
            })
    }
}

export default DatabaseService