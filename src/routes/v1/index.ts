import express from "express";
import userRoutes from "./userRoute.js";
import postRoutes from "./postRoute.js";

const v1Routes = express.Router();

v1Routes.use("/api/v1", userRoutes, postRoutes);

export default v1Routes;
