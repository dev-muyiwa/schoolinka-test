import express, {Router} from "express";
import BlogController from "../controllers/blog.controller";
import {checkAuthorizationToken} from "../middlewares/authHandler";

const blogRouter: Router = express.Router();
const blogController = new BlogController();


blogRouter.use(checkAuthorizationToken)

blogRouter.route("/")
    .get(blogController.getAllBlogs)
    .post(blogController.createBlog);

blogRouter.route("/:blogId")
    .get(blogController.getBlog)
    .put(blogController.updateBlog)
    .delete(blogController.deleteBlog)

export default blogRouter;