import mongoose, {Schema, model} from "mongoose";
import Review from "./Review";
import { ObjectId } from 'mongodb';

interface Image {
    url: string;
    filename: string;
}

interface Review {
    body: string;
    rating: number;
    author: ObjectId;
}

interface Geometry {
    type: string;
    coordinates: number[]
}

export interface IHome {
    _id: ObjectId;
    title: string;
    images: Image[];
    geometry: Geometry;
    price: number;
    description: string;
    location: string;
    author: ObjectId;
    reviews: Review[]
}

const opts = { toJSON: { virtuals: true }};

export const ImageSchema = new Schema <Image> (
    {
        url: String,
        filename: String
    }
);

export const HomeSchema = new Schema <IHome> ({
    // _id: Schema.Types.ObjectId,
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String, 
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
}, opts);

ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_200")
})

HomeSchema.virtual("properties.popUpMarkup").get(function(){
    return `<strong><a href="/homess/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 30)}</p>`
});

HomeSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

export default model("Home", HomeSchema)

