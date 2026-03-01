"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHelper = void 0;
exports.emitToUser = emitToUser;
const colors_1 = __importDefault(require("colors"));
const logger_1 = require("../shared/logger");
let ioInstance;
const socket = (io) => {
    ioInstance = io;
    io.on("connection", (socket) => {
        logger_1.logger.info(colors_1.default.blue("A User connected"));
        socket.on("register", (userId) => {
            if (userId) {
                socket.userId = userId;
                logger_1.logger.info(colors_1.default.green(`User ${userId} registered`));
            }
        });
        // disconnect
        socket.on("disconnect", () => {
            logger_1.logger.info(colors_1.default.red("A user disconnect"));
        });
    });
};
exports.socketHelper = { socket };
function emitToUser(userId, event, payload) {
    if (!ioInstance) {
        logger_1.logger.warn("Socket.IO not initialized");
        return;
    }
    for (const client of ioInstance.sockets.sockets.values()) {
        const s = client;
        if (s.userId === userId) {
            s.emit(event, payload);
        }
    }
}
