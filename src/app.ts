import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import { StatusCodes } from "http-status-codes";

import { Morgan } from "./shared/morgan";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { PaymentController } from "./app/modules/payment/payment.controller";
import router from "./app/routes";

const app: Application = express();

/**
 * =========================
 * Stripe Webhook (RAW BODY)
 * =========================
 * Must be BEFORE express.json()
 */
// app.post(
//   "/api/v1/payments/webhook/stripe",
//   express.raw({ type: "application/json" }),
//   PaymentController.stripeWebhook,
// );
// Stripe webhook (must be RAW body)
// Stripe webhook must use raw body
app.post(
  "/api/v1/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.stripeWebhook,
);


/**
 * =========================
 * CORS (GLOBAL)
 * =========================
 */
app.use(
  cors({
    origin: [
      "http://dashboard.adrienticket.com",
      "http://72.62.190.141:4173",
      "http://adrienticket.com",
      "http://72.62.190.141:3000",
      "http://10.10.7.49:3000",
      "http://10.10.7.49:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  }),
);

/**
 * =========================
 * View Engine
 * =========================
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/**
 * =========================
 * Logger
 * =========================
 */
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

/**
 * =========================
 * Body Parsers
 * =========================
 * multipart/form-data handled by multer (NOT here)
 */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/**
 * =========================
 * Static Files
 * =========================
 * uploads/image
 * uploads/thumbnail
 * uploads/seatingView
 * etc.
 */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/**
 * =========================
 * API Routes
 * =========================
 */
app.use("/api/v1", router);

/**
 * =========================
 * Health Check
 * =========================
 */
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

/**
 * =========================
 * Global Error Handler
 * =========================
 */
app.use(globalErrorHandler);

/**
 * =========================
 * Not Found Handler
 * =========================
 */
app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST",
      },
    ],
  });
});

export default app;
 