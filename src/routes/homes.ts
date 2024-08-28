import express, { Request, Response, NextFunction } from 'express';
import multer, { Multer } from 'multer';
import HomeController from '../controllers/homecontroller';
import { options } from 'joi';
import CloudinaryService from "../cloudinary";
import middleware  from '../middleware';
// import { isLoggedIn, isAuthor, validateHome } from '../middleware';

class HomeRouter {
    public router: express.Router;
    private upload: Multer; 
    private cloudinary
    private storage

    constructor() {
        this.cloudinary = new CloudinaryService();
        this.storage = this.cloudinary.getStorage() as any;
        this.router = express.Router();
        this.upload = multer({ storage: this.storage });
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.route('/')
            .get(HomeController.index)
            .post(middleware.isLoggedIn, this.upload.array('image'), middleware.validateHome, HomeController.createHome);

        this.router.get('/new', middleware.isLoggedIn, HomeController.renderNewHomeForm);

        this.router.route('/:id')
            .get(middleware.isLoggedIn, HomeController.showHome)
            .put(middleware.isLoggedIn, this.upload.array('image'), middleware.validateHome, middleware.isAuthor, HomeController.updateHome)
            .delete(middleware.isLoggedIn, middleware.isAuthor, HomeController.deleteHome);

        this.router.get('/:id/edit', middleware.isLoggedIn,  middleware.isAuthor, HomeController.renderEditHomeForm);
    }
}

export default new HomeRouter().router;
