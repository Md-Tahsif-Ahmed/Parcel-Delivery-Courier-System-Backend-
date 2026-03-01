"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const http_status_codes_1 = require("http-status-codes");
const morgan_1 = require("./shared/morgan");
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const payment_controller_1 = require("./app/modules/payment/payment.controller");
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
/**
 * =========================
 * Stripe Webhook (RAW BODY)
 * =========================
 * Must be BEFORE express.json()
 */
app.post("/api/v1/payments/webhook/stripe", express_1.default.raw({ type: "application/json" }), payment_controller_1.PaymentController.stripeWebhook);
/**
 * =========================
 * CORS (GLOBAL)
 * =========================
 */
app.use((0, cors_1.default)({
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
}));
/**
 * =========================
 * View Engine
 * =========================
 */
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "views"));
/**
 * =========================
 * Logger
 * =========================
 */
app.use(morgan_1.Morgan.successHandler);
app.use(morgan_1.Morgan.errorHandler);
/**
 * =========================
 * Body Parsers
 * =========================
 * multipart/form-data handled by multer (NOT here)
 */
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
/**
 * =========================
 * Static Files
 * =========================
 * uploads/image
 * uploads/thumbnail
 * uploads/seatingView
 * etc.
 */
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
/**
 * =========================
 * API Routes
 * =========================
 */
app.use("/api/v1", routes_1.default);
/**
 * =========================
 * Health Check
 * =========================
 */
app.get("/", (req, res) => {
    res.send("Server is running...");
});
/**
 * =========================
 * Global Error Handler
 * =========================
 */
app.use(globalErrorHandler_1.default);
/**
 * =========================
 * Not Found Handler
 * =========================
 */
app.use((req, res) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
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
exports.default = app;
// import express, { Application, Request, Response } from "express";
// import cors from "cors";
// import { StatusCodes } from "http-status-codes";
// import { Morgan } from "./shared/morgan";
// import globalErrorHandler from "./app/middlewares/globalErrorHandler";
// import path from "path";
// import { PaymentController } from "./app/modules/payment/payment.controller";
// import { globalRateLimiter } from "./app/middlewares/rateLimiter";
// import router from "./app/routes";
// const app: Application = express();
// app.post(
//   "/api/v1/payments/webhook/stripe",
//   express.raw({ type: "application/json" }),
//   PaymentController.stripeWebhook,
// );
// // ====================
// app.use(
//   cors({
//     origin: [
//       "http://dashboard.adrienticket.com",
//       "http://adrienticket.com",
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
//   }),
// );
// // ====================
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// // morgan
// app.use(Morgan.successHandler);
// app.use(Morgan.errorHandler);
// //body parser
// // app.use(
// //   cors({
// //     origin: [
// //       "http://10.10.7.46:3001",
// //       "http://10.10.7.49:3000",
// //       "http://72.62.190.141:3000",
// //       "http://adrienticket.com",
// //       "http://72.62.190.141:4173",
// //       "http://dashboard.adrienticket.com",
// //       // "http://10.10.7.41:5003",
// //       // "http://10.10.7.49:1001",
// //       // "http://10.10.7.6:1001",
// //       // "https://admin-ticket-booking.netlify.app",
// //       // "https://ticket-booking-dashboard-ad.vercel.app",
// //       // "https://adrien-ticket-booking-website.vercel.app",
// //     ],
// //     credentials: true,
// //     allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"], // Make sure necessary headers are allowed
// //     exposedHeaders: ["x-auth-token"],
// //   }),
// // );
// // app.use(express.json({ limit: "1mb" }));
// // // app.use(express.urlencoded({ extended: true }));
// // app.use(express.urlencoded({ extended: true, limit: "1mb" }));
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// //file retrieve
// app.use(express.static("uploads"));
// // ✅ Serve thumbnails
// app.use("/thumbnail", express.static(path.join(__dirname, "../thumbnail")));
// // ✅ Serve seatingView images
// app.use("/seatingView", express.static(path.join(__dirname, "../seatingView")));
// //router
// app.use("/api/v1", router);
// app.get("/", (req: Request, res: Response) => {
//   res.send("Server is running...");
// });
// //global error handle
// app.use(globalErrorHandler);
// // handle not found route
// app.use((req: Request, res: Response) => {
//   res.status(StatusCodes.NOT_FOUND).json({
//     success: false,
//     message: "Not Found",
//     errorMessages: [
//       {
//         path: req.originalUrl,
//         message: "API DOESN'T EXIST",
//       },
//     ],
//   });
// });
// export default app;
