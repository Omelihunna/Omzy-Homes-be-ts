import Home from "../models/homes";
import Review from "../models/Review";
import { Request, Response, NextFunction } from "express"
import { IUser } from "../models/User";

class ReviewController {
    public static async createReview (req: Request, res: Response, next: NextFunction) {
        try {
            const home = await Home.findById(req.params.id);
            const review = new Review(req.body.review);
            review.author = (req.user as IUser)._id;
            home?.reviews.push(review);
            // const reviewAuthor = await User.findById(review.author)
            // console.log(reviewAuthor)
            // console.log(review)
            await review.save();
            await home?.save();
            req.flash("success", "Succesfully Created a new Review");
            res.redirect(`/homes/${home?._id}`);
        }
        catch (e) {
            next(e)
        }
    }

    public static  async deleteReview (req: Request, res: Response, next: NextFunction) {
        try {
            const { id, reviewId } = req.params;
            await Home.findByIdAndUpdate(id, {$pull: { reviews: reviewId}});
            await Review.findByIdAndDelete(reviewId)
            req.flash("success", "Succesfully Deleted Review");
            res.redirect(`/homes/${id}`)
        }
        catch (e) {
            next (e)
        }
    };
}

export default ReviewController