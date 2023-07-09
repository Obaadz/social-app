import express from "express";
import userRoutes from "./userRoute.js";
import postRoutes from "./postRoute.js";
import commentRoutes from "./commentRoute.js";

const v1Routes = express.Router();

v1Routes.use("/api/v1", userRoutes, postRoutes, commentRoutes);

export default v1Routes;
