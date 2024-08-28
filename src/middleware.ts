import { Request, Response, NextFunction } from 'express';
// import { Home, Review } from './models';
import Home from "./models/homes";
import Review from "./models/Review"
import {HomeSchema, ReviewSchema} from './schemas';
import ExpressError from './utils/ExpressError';
import { AnyError } from 'mongodb';
import { IUser } from './models/User';


class Middleware {
    public isLoggedIn(req: Request, res: Response, next: NextFunction): void {
        // console.log(req.session)
        // console.log(req.user)
        // console.log(res.locals)
        // console.log(req.isAuthenticated())
        if (!req.isAuthenticated()) {
            this.storeReturnTo;
            req.flash('error', 'You have to be signed in to do that');
            return res.redirect('/login');
        }
        next();
    }

    public storeReturnTo(req: Request, res: Response, next: NextFunction): void {
        if (req.session.returnTo) {
            res.locals.returnTo = req.session.returnTo;
        }
        next();
    }

    public async isAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const home = await Home.findById(id);
            if (!home || String(home.author) !== String((req.user as IUser)._id)) {
                req.flash('error', 'You do not have permission to do that');
                return res.redirect(`/homes/${id}`);
            }
            next();
        } catch (e) {
            next(e);
        }
    }

    public async isReviewAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id, reviewId } = req.params;
            const review = await Review.findById(reviewId);
            if (!review || String(review.author) !== String((req.user as IUser)._id)) {
                req.flash('error', 'You do not have permission to do that');
                return res.redirect(`/homes/${id}`);
            }
            next();
        } catch (e) {
            next(e);
        }
    }

    public validateHome(req: Request, res: Response, next: NextFunction): void {
        console.log("Req.body should be here:", req.body)
        const { error } = HomeSchema.validate(req.body);
        if (error) {
            const msg = error.details.map((el: AnyError) => el.message).join(',');
            throw new ExpressError(msg, 400);
        } else {
            next();
        }
    }

    public validateReview(req: Request, res: Response, next: NextFunction): void {
        const { error } = ReviewSchema.validate(req.body);
        if (error) {
            const msg = error.details.map((el: AnyError) => el.message).join(',');
            throw new ExpressError(msg, 400);
        } else {
            next();
        }
    }
}

export default new Middleware();
