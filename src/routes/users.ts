import passport, { PassportStatic } from "passport";
import express, { Router } from "express";
import UserController from "../controllers/Usercontroller";
import middleware from "../middleware";

class UserRouter {
    public router: Router
    passport: passport.PassportStatic;

    constructor(passport: PassportStatic) {
        this.passport = passport
        this.router = express.Router({ mergeParams: true })
        this.initializeRoutes();
        // console.log(this.passport)
    }

    private initializeRoutes() {
        this.router.route("/register")
            .get(UserController.renderRegisterUserForm)
            .post(UserController.registerUser);

        this.router.route("/login")
            .get(UserController.renderLoginForm)
            .post(middleware.storeReturnTo, this.passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), UserController.loginUser);

        this.router.get("/logout", UserController.logoutUser);
    }
}

export default UserRouter;