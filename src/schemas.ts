import baseJoi, { Root, StringSchema } from 'joi';
import { Response, Request, NextFunction } from 'express';
import sanitizeHTML from 'sanitize-html';

// Define the extension interface
export function sanitizeInput(req: Request, res: Response, next: NextFunction): void {
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeHTML(req.body[key], {
                    allowedTags: [],
                    allowedAttributes: {},
                });
            }
        }
    }
    next();
}


// Extend the base Joi object with the extension
const Joi = baseJoi

// Define the schema interfaces
interface HomeSchema {
    title: string;
    price: number;
    images?: any[];
    location: string;
    description: string;
}

interface ReviewSchema {
    rating: number;
    body: string;
}

// Define the campground schema
export const HomeSchema = Joi.object({
    home: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        images: Joi.array(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array(),
});

// Define the review schema
export const ReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    })
});

