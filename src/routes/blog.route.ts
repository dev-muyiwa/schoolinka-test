import express, {Router} from "express";
import BlogController from "../controllers/blog.controller";
import {checkAuthorizationToken, checkValidationErrors} from "../middlewares/authHandler";
import {check} from "express-validator";

const blogRouter: Router = express.Router();
const blogController: BlogController = new BlogController();


blogRouter.use(checkAuthorizationToken)

blogRouter.route("/")
    .get(blogController.getAllBlogs)
    .post(check("title").notEmpty(),
        check("content").notEmpty(),
        checkValidationErrors, blogController.createBlog);

blogRouter.route("/:blogId")
    .get(blogController.getBlog)
    .put(blogController.updateBlog)
    .delete(blogController.deleteBlog)

export default blogRouter;