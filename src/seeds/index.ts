import DatabaseService from "../Databases/DatabaseService";
import Home, { IHome } from "../models/homes";
import cities from "./cities";
import { places, descriptors } from "./seedHelper";
import * as dotenv from "dotenv"
dotenv.config()

const MONGO_URL = process.env.MONGO_URL as string;

class Seed {
    private Db: DatabaseService

    constructor() {
        this.Db = new DatabaseService(MONGO_URL)
    }

    private sample (array: string[]) {
        return array[Math.floor(Math.random() * array.length)]
    }

    public initializeDatabase(): void {
        this.Db.connect()
    }

    public async seedDB(): Promise <void> {
        await Home.deleteMany({});
        for (let i = 0; i < 50; i++) {
            const random1000 = Math.floor(Math.random() * 1000);
            const price = Math.floor(Math.random() * 20) + 10
            const home = new Home({
                author: "662f590b362be038d2683b47",
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${this.sample(descriptors)}, ${this.sample(places)}`,
                description: "Lorem ipsum",
                price,
                geometry: {
                    type: "Point",
                    coordinates: [
                        cities[random1000].longitude,
                        cities[random1000].latitude
                    ]
                },
                images: [
                    {
                        url: "https://res.cloudinary.com/dghmtarj6/image/upload/v1714835546/u4asy3tqzjeqmtokmyf0.jpg",
                        filename: 'YelpCampm/q4uyvdgpbk1czljwhpjq'
                    }
                ]
            })
            await home.save();
        }
    }

    public disconnectDB () {
        this.Db.disconnect()
    }
}

const seed = new Seed
seed.initializeDatabase()
seed.seedDB().then(() => {
    seed.disconnectDB()
})

