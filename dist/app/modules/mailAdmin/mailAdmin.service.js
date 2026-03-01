"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const emailHelper_1 = require("../../../helpers/emailHelper");
const emailTemplate_1 = require("../../../shared/emailTemplate");
exports.ContactService = {
    sendContactMessage: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const emailValues = {
            name: payload.name,
            email: payload.email,
            subject: payload.subject,
            message: payload.message,
        };
        const contactTemplate = emailTemplate_1.emailTemplate.contactMessage(emailValues);
        yield emailHelper_1.emailHelper.sendEmail(contactTemplate);
        return { message: 'Message sent successfully' };
    }),
};
