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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundPolicyController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const refund_policy_service_1 = require("./refund-policy.service");
const createRefundPolicy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield refund_policy_service_1.RefundPolicyService.upsertRefundPolicyToDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Refund Policy Created Successfully",
        data: result,
    });
}));
// const updateRefundPolicy = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const payload: Partial<IRefundPolicy> = req.body;
//   const result = await RefundPolicyService.updateRefundPolicyToDB(id, payload);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Refund Policy Updated Successfully",
//     data: result,
//   });
// });
const getRefundPolicy = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield refund_policy_service_1.RefundPolicyService.getRefundPolicyFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Refund Policy Retrieved Successfully",
        data: result,
    });
}));
const deleteRefundPolicy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield refund_policy_service_1.RefundPolicyService.deleteRefundPolicyToDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Refund Policy Deleted Successfully",
        data: null,
    });
}));
exports.RefundPolicyController = {
    createRefundPolicy,
    // updateRefundPolicy,
    getRefundPolicy,
    deleteRefundPolicy,
};
