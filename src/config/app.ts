import express, {Application} from "express";
import authRouter from "../routes/authRoutes";
import userRouter from "../routes/userRoutes";
import {apiErrorHandler, routeNotFound} from "../middlewares/errorHandler";

const app: Application = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/blog", userRouter);

app.use(routeNotFound);
app.use(apiErrorHandler);

export default app;