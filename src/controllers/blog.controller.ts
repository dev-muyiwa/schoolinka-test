import {Request, Response} from "express";
import {AuthenticatedRequest} from "../middlewares/authHandler";
import Blog from "../models/blog.model";
import {sendErrorResponse, sendSuccessResponse} from "../utils/ResponseHandlers";
import {CustomError} from "../utils/CustomError";

class BlogController {
    async createBlog(req: AuthenticatedRequest, res: Response) {
        try {
            // Add image path.
            const {title, description, content} = req.body;

            const blog = await Blog.create({
                title: title,
                description: description,
                content: content
            });

            return sendSuccessResponse(res, blog, "Blog created", 201);
        } catch (err) {
            return sendErrorResponse(res, err);
        }
    }

    async getBlog(req: Request, res: Response) {
        try {
            const {blogId} = req.params;
            const blog: Blog | null = await Blog.findByPk(blogId);
            if (!blog) {
                throw new CustomError("Blog does not exist")
            }
            // Only increment view if it's not from the blog author
            blog.views += 1;
            await blog.save();

            return sendSuccessResponse(res, blog, "Blog retrieved");
        } catch (err) {
            return sendErrorResponse(res, err);
        }
    }

    async getAllBlogs(req: Request, res: Response) {
        try {
            // Paginate the list
            // To shuffle the list or not too?
            const blogs: Blog[] = await Blog.findAll({where: {isDraft: false}});

            return sendSuccessResponse(res, blogs, "All blogs fetched");
        } catch (err) {
            return sendErrorResponse(res, err)
        }
    }

    async getDrafts(req: AuthenticatedRequest, res: Response) {
        try {
            // const
        } catch (err) {
            // return sendErrorResponse(res, err);
        }
    }

    async searchBlogs(req: Request, res: Response) {

    }

    async updateBlog(req: Request, res: Response) {

    }

    async deleteBlog(req: Request, res: Response) {

    }
}

export default BlogController;