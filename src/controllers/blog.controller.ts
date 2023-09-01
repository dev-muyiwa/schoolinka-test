import {Request, Response} from "express";
import Blog from "../models/blog.model";
import User from "../models/user.model";
import {CustomError} from "../utils/CustomError";
import {AuthenticatedRequest} from "../middlewares/authHandler";
import {sendErrorResponse, sendSuccessResponse} from "../utils/ResponseHandlers";
import {Op} from "sequelize";

class BlogController {
    async createBlog(req: AuthenticatedRequest, res: Response) {
        try {
            // Add image path.
            const {title, description, content, isDraft} = req.body;

            const blog = await Blog.create({
                title: title,
                description: description,
                content: content,
                isDraft: isDraft ?? false,
                authorId: req.user?.id
            });

            return sendSuccessResponse(res, blog, "Blog created", 201);
        } catch (err) {
            return sendErrorResponse(res, err);
        }
    }

    async getBlog(req: AuthenticatedRequest, res: Response) {
        try {
            const {blogId} = req.params;
            const blog: Blog | null = await Blog.findByPk(blogId);
            if (!blog) {
                throw new CustomError("Blog does not exist")
            }

            if (blog.authorId !== req.user!!.id) {
                blog.views += 1;
                await blog.save();
            }

            return sendSuccessResponse(res, blog, "Blog retrieved");
        } catch (err) {
            return sendErrorResponse(res, err);
        }
    }

    async getAllBlogs(req: Request, res: Response) {
        try {
            const searchQuery = req.query.q || ""
            const currentPage: number = Number(req.query.page) || 1;
            const perPage: number = 10;
            const offset: number = (currentPage - 1) * perPage;

            const blogs = await Blog.findAndCountAll({
                where: {
                    isDraft: false,
                    [Op.or]: [
                        {
                            title: {[Op.iLike]: `%${searchQuery}%`}
                        },
                        {
                            description: {[Op.iLike]: `%${searchQuery.toString()}%`}
                        }
                    ]
                },
                limit: perPage,
                offset: offset,
            });
            const data = {
                currentPage: currentPage,
                blogs: blogs.rows,
                perPage: perPage,
                totalPages: Math.ceil(blogs.count / perPage)
            }

            return sendSuccessResponse(res, data, "Blogs fetched");
        } catch (err) {
            return sendErrorResponse(res, err)
        }
    }

    async updateBlog(req: AuthenticatedRequest, res: Response) {
        try {
            const {title, description, content} = req.body;
            const {blogId} = req.params;

            const blog: Blog | null = await Blog.findByPk(blogId);
            if (!blog) {
                throw new CustomError("Blog does not exist");
            }

            if (blog.authorId !== req.user?.id) {
                throw new CustomError("Unable to update this blog", CustomError.FORBIDDEN)
            }

            blog.title = title ?? blog.title;
            blog.description = description ?? blog.description;
            blog.content = content ?? blog.content;

            await blog.save();

            return sendSuccessResponse(res, blog, "Blog updated");
        } catch (err) {
            return sendErrorResponse(res, err);
        }
    }

    async deleteBlog(req: AuthenticatedRequest, res: Response) {
        try {
            const {blogId} = req.params;
            const blog: Blog | null = await Blog.findByPk(blogId);
            if (!blog) {
                throw new CustomError("Blog does not exist");
            }

            if (blog.authorId !== req.user?.id) {
                throw new CustomError("Unable to delete this blog", CustomError.FORBIDDEN)
            }

            await blog.destroy()

            return sendSuccessResponse(res, null, "Blog deleted");
        } catch (err) {
            return sendErrorResponse(res, err);
        }
    }
}

export default BlogController;