import { Request, Response, NextFunction } from "express";
import Home from "../models/homes";
import { IUser } from "../models/User";
import CloudinaryService from "../cloudinary";
import mbxGeoCoding from "@mapbox/mapbox-sdk/services/geocoding";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config()
const mapBoxToken = process.env.MAPBOX_TOKEN as string;
const geoCoder = mbxGeoCoding({ accessToken: mapBoxToken });

class HomeController {
    public static async index(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const homes = await Home.find();
            res.render("homes/index", { homes });
        } catch (e) {
            next(e);
        }
    }

    public static async createHome(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const geoData = await geoCoder
                .forwardGeocode({
                    query: req.body.home.location,
                    limit: 1,
                })
                .send();
            const home = new Home(req.body.home);
            if (home !== null) {
                home.geometry = geoData.body.features[0].geometry;
                home.images = Array.isArray(req.files) ? req.files.map((f: any) => ({
                    url: f.path,
                    filename: f.filename,
                })) : [];
                home.author = (req.user as IUser)._id;
                await home.save();
                req.flash("success", "Succesfully Created a new home");
                res.redirect(`/homes/${home._id}`);
            }
        } catch (e) {
            next(e);
        }
    }

    public static renderNewHomeForm(req: Request, res: Response): void {
        res.render("homes/new");
    }


    public static async showHome(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const home = await Home.findById(req.params.id)
                .populate("reviews")
                .populate({
                    path: "reviews",
                    populate: { path: "author", model: "User" },
                })
                .populate("author");
            
            if (!home) {
                req.flash("error", "Cannot find any home with this ID");
                return res.redirect("/homes");
            }
    
            // console.log("Populated home:", home);
    
            if (!home.author) {
                req.flash("error", "Author information is missing for this home");
                return res.redirect("/homes");
            }
    
            res.render("homes/show", { home });
        } catch (e) {
            console.error("Error fetching and populating home:", e);
            next(e);
        }
    }
    

    public static async renderEditHomeForm(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const home = await Home.findById(req.params.id);
            if (!home) {
                req.flash("error", "Cannot find that home!!");
                return res.redirect("/homes");
            }
            res.render("homes/edit", { home });
        } catch (e) {
            next(e);
        }
    }

    public static async updateHome(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const cloudinary = new CloudinaryService
            const { id } = req.params;
            const home = await Home.findByIdAndUpdate(id, { ...req.body.home });
            if (home !== null) {
                const images = Array.isArray(req.files) ? req.files.map((f: any) => ({
                    url: f.path,
                    filename: f.filename,
                })) : [];
                home.images.push(...images);
                await home.save();
                if (req.body.deleteImages) {
                    for (let filename of req.body.deleteImages) {
                        (cloudinary.getCloudinary() as any).uploader.destroy(filename);
                    }
                    await home.updateOne({
                        $pull: { images: { filename: { $in: req.body.deleteImages } } },
                    });
                }
                req.flash("success", "Succesfully Updated home");
                res.redirect(`/homes/${home._id}`);
            }
        } catch (e) {
            next(e);
        }
    }

    public static async deleteHome(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            await Home.findByIdAndDelete(id);
            req.flash("success", "Succesfully Deleted home");
            res.redirect("/homes");
        } catch (e) {
            next(e);
        }
    }
}

export default HomeController;
