import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

class UserController {
    public static renderRegisterUserForm(req: Request, res: Response): void {
        res.render("users/register");
    }

    public static async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, (err: any) => {
                if (err) return next(err);
                req.flash("success", "Welcome to OMZHOMES");
                res.redirect("/homes");
            });
        } catch (error: any) {
            req.flash("error", error.message);
            res.redirect("/register");
        }
    }

    public static async renderLoginForm(req: Request, res: Response): Promise<void> {
        res.render("users/login");
    }

    public static loginUser(req: Request, res: Response): void {
        const redirectUrl = (res.locals.returnTo as string) || '/homes';
        console.log(redirectUrl)
        req.flash("success", "Welcome Back");
        res.redirect(redirectUrl);
    }

    public static logoutUser(req: Request, res: Response, next: NextFunction): void {
        req.logout(err => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Successfully logged you out");
            res.redirect("/homes");
        });
    }
}

export default UserController;
