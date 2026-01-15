import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import router from "./routes";
import envVars from "./config/env";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  envVars.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (envVars.NODE_ENV === "development") {
        // In development, allow all origins
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
