import { ObjectId } from 'mongodb';
import { Schema, model } from  'mongoose';


interface Review {
    body: string;
    rating: number;
    author: ObjectId;
}

const  reviewSchema = new Schema <Review> ({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

export default model ("Review", reviewSchema);