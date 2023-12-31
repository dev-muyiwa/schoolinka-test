import express, {Application} from "express";
import cors from "cors";
import authRouter from "../routes/auth.route";
import userRouter from "../routes/user.route";
import {apiErrorHandler, routeNotFound} from "../middlewares/errorHandler";
import blogRouter from "../routes/blog.route";

const app: Application = express();

app.use(cors({
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/blogs", blogRouter);

app.use(routeNotFound);
app.use(apiErrorHandler);

export default app;