import express, { Request, Response, NextFunction } from 'express';
import ReviewController from '../controllers/reviewcontroller';
import middleware from '../middleware';

class ReviewsRouter {
    public router = express.Router({ mergeParams: true });

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/', middleware.isLoggedIn, middleware.validateReview, this.createReview);
        this.router.delete('/:reviewId', middleware.isLoggedIn, middleware.isReviewAuthor, this.deleteReview);
    }

    private createReview(req: Request, res: Response, next: NextFunction) {
        ReviewController.createReview(req, res, next);
    }

    private deleteReview(req: Request, res: Response, next: NextFunction) {
        ReviewController.deleteReview(req, res, next);
    }
}

export default new ReviewsRouter().router;
