"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailAdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mailAdmin_validation_1 = require("./mailAdmin.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const mailAdmin_controller_1 = require("./mailAdmin.controller");
const router = express_1.default.Router();
router.post('/', (0, validateRequest_1.default)(mailAdmin_validation_1.ContactValidation.sendContactMessage), mailAdmin_controller_1.ContactController.sendContactMessage);
exports.MailAdminRoutes = router;
