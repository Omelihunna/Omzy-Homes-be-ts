import baseJoi, { Root, StringSchema } from 'joi';
import sanitizeHTML from 'sanitize-html';

// Define the extension interface
interface Extension {
    type: 'string';
    base: StringSchema;
    messages: {
        'string.escapeHTML': string;
    };
    rules: {
        escapeHTML: {
            validate(value: string, helpers: any): string | void;
        };
    };
}

// Define the extension class
class EscapeHTMLExtension implements Extension {
    type: 'string' = 'string';
    base: StringSchema = baseJoi.string();
    messages = {
        'string.escapeHTML': '{{#label}} must not contain HTML tags',
    };
    rules = {
        escapeHTML: {
            validate(value: string, helpers: any) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value });
                return clean;
            },
        },
    };
}

// Extend the base Joi object with the extension
const Joi = baseJoi.extend(new EscapeHTMLExtension());

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
        body: Joi.string().required().escapeHTML()
    })
});

