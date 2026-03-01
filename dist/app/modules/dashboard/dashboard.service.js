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
exports.DashboardService = void 0;
const user_model_1 = require("../user/user.model");
const transaction_model_1 = __importDefault(require("../payment/transaction.model"));
const event_model_1 = require("../event/event.model");
const getDashboardData = (year) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year + 1, 0, 1);
    const [totalRevenue, totalTicketsSold, totalUsers, premiumUsers, monthlyRevenue, monthlyTicketSales,] = yield Promise.all([
        // Total revenue for the year
        transaction_model_1.default.aggregate([
            {
                $match: {
                    status: "succeeded",
                    createdAt: { $gte: yearStart, $lt: yearEnd },
                },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        // Total tickets sold across events in the year
        event_model_1.EventModel.aggregate([
            {
                $match: {
                    eventDate: { $gte: yearStart, $lt: yearEnd },
                },
            },
            { $group: { _id: null, total: { $sum: "$ticketSold" } } },
        ]),
        // Total users
        user_model_1.User.countDocuments({ role: "USER" }),
        // Premium users
        user_model_1.User.countDocuments({ isPremium: true }),
        // Monthly revenue by month
        transaction_model_1.default.aggregate([
            {
                $match: {
                    status: "succeeded",
                    createdAt: { $gte: yearStart, $lt: yearEnd },
                },
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    value: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]),
        // Monthly ticket sales by eventDate
        event_model_1.EventModel.aggregate([
            {
                $match: {
                    eventDate: { $gte: yearStart, $lt: yearEnd },
                },
            },
            {
                $group: {
                    _id: { $month: "$eventDate" },
                    value: { $sum: "$ticketSold" },
                },
            },
            { $sort: { _id: 1 } },
        ]),
    ]);
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const revenueChart = months.map((month, index) => {
        const found = monthlyRevenue.find(m => m._id === index + 1);
        return { month, value: (found === null || found === void 0 ? void 0 : found.value) || 0 };
    });
    const ticketSalesChart = months.map((month, index) => {
        const found = monthlyTicketSales.find(m => m._id === index + 1);
        return { month, value: (found === null || found === void 0 ? void 0 : found.value) || 0 };
    });
    return {
        summary: {
            revenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            ticketsSold: ((_b = totalTicketsSold[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
            users: totalUsers,
            premiumMembers: premiumUsers,
        },
        charts: {
            monthlyRevenue: revenueChart,
            monthlyTicketSales: ticketSalesChart,
        },
    };
});
exports.DashboardService = {
    getDashboardData,
};
