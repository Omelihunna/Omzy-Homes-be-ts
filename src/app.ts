import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import session, { Store } from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUser } from './models/User';
import homeRoutes from './routes/homes';
import reviewRoutes from './routes/reviews';
import userRoutes from './routes/users';
import ExpressError from './utils/ExpressError';
import DatabaseService from './Databases/DatabaseService';
import * as dotenv from "dotenv"
import bodyParser = require('body-parser');
dotenv.config()

const MONGO_URL = process.env.MONGO_URL as string;

interface SessionConfig {
    store: Store;
    name: string;
    secret: string;
    resave: boolean;
    saveUninitialized: boolean;
    cookie: {
        httpOnly: boolean;
        // secure?: boolean; // Commented out since it's optional
        expires: Date;
        maxAge: number;
    };
}

class App {
    public app: express.Application;
    private readonly port: number = 4000;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeDatabase();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares(): void {
        // this.app.engine("ejs", ejsMate)
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set("layout", "boilerplate");
        this.app.set("layout extractScripts", true)
        this.app.use(bodyParser.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(bodyParser.urlencoded({extended: true}))
        this.app.use(methodOverride('_method'));
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(mongoSanitize());

        const weekInMilli = 1000 * 60 * 60 * 24 * 7;
        const store = MongoStore.create({
            mongoUrl: MONGO_URL,
            touchAfter: 24 * 60 * 60,
            crypto: {
                secret: 'thisshouldbeabettersecret!',
            },
        });

        store.on('error', (e) => {
            console.log('SESSION STORE ERROR', e);
        });

        const sessionConfig = {
            store,
            name: 'session',
            secret: 'thisshouldbeabettersecret!',
            resave: true,
            saveUninitialized: true,
            cookie: {
                httpOnly: true,
                // sameSite: "none",
                // secure: true, // false in development
                expires: new Date(Date.now() + weekInMilli),
                maxAge: weekInMilli,
            },
        };

        this.app.use(session(sessionConfig));
        this.app.use(flash());
        this.app.use(helmet());
        this.app.use(passport.session());
        this.app.use(passport.initialize());
        
        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser((User as any).serializeUser());
        passport.deserializeUser(User.deserializeUser());

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.locals.currentUser = req.user as IUser;
            res.locals.success = req.flash('success');
            res.locals.error = req.flash('error');
            next();
        });

        const scriptSrcUrls = ['https://stackpath.bootstrapcdn.com/', 'https://api.tiles.mapbox.com/', 'https://api.mapbox.com/', 'https://kit.fontawesome.com/', 'https://cdnjs.cloudflare.com/', 'cdn.jsdelivr.net', 'https://cdn.tailwindcss.com/'];
        const styleSrcUrls = ['https://stackpath.bootstrapcdn.com/', 'https://api.tiles.mapbox.com/', 'https://api.mapbox.com/', 'https://kit-free.fontawesome.com/', 'https://fonts.googleapis.com/', 'https://use.fontawesome.com/', 'http://cdn.jsdelivr.net/'];
        const connectSrcUrls = ['https://api.mapbox.com/', 'https://a.tiles.mapbox.com/', 'https://b.tiles.mapbox.com/', 'https://events.mapbox.com/'];
        const imgSrcUrls = ["'self'", 'blob:', 'data:', 'https://res.cloudinary.com/', 'https://images.unsplash.com', 'https://t3.ftcdn.net', 'https://png.pngtree.com/'];
        const fontSrcUrls: string[] = [];

        this.app.use(
            helmet.contentSecurityPolicy({
                directives: {
                    defaultSrc: [],
                    connectSrc: ["'self'", ...connectSrcUrls],
                    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-hashes'",  ...scriptSrcUrls],
                    styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
                    workerSrc: ["'self'", 'blob:'],
                    objectSrc: [],
                    imgSrc: imgSrcUrls,
                    fontSrc: ["'self'", ...fontSrcUrls]
                },
            })
        );
    }

    private initializeDatabase(): void {
        const Db = new DatabaseService(MONGO_URL)
        Db.connect()
    }

    private initializeRoutes(): void {
        this.app.use('/homes', homeRoutes);
        this.app.use('/homes/:id/reviews', reviewRoutes);
        this.app.use("/", new userRoutes(passport).router )
        this.app.get('/', (req: Request, res: Response) => {
            res.render('home');
        });
        this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
            next(new ExpressError('Page Not Found', 404));
        });
    }

    private initializeErrorHandling(): void {
        this.app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
            const { statusCode = 500 } = err;
            if (!err.message) err.message = 'Something went wrong';
            res.status(statusCode).render('error', { err });
        });
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server is running on ${this.port}`);
        });
    }
}

export default App;
