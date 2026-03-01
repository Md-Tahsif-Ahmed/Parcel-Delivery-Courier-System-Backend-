"use strict";
// const generateOTP = () => {
//   return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
// };
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// export default generateOTP;
const crypto_1 = __importDefault(require("crypto"));
const generateOTP = () => {
    return crypto_1.default.randomInt(1000, 10000);
};
exports.default = generateOTP;
