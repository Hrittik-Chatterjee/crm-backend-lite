import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import router from "./routes";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: true, // Allow all origins (configure as needed)
    credentials: true,
  })
);

// Health check route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "CRM Backend Server is running",
  });
});

// API routes
app.use("/api/v1", router);

// Error handling
app.use(globalErrorHandler);
app.use(notFound);

export default app;
