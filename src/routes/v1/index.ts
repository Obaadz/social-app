import express from "express";
import userRoutes from "./userRoute.js";

const v1Routes = express.Router();

v1Routes.use("/api/v1", userRoutes);

export default v1Routes;
