"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const faq_route_1 = require("../modules/faq/faq.route");
const media_route_1 = require("../modules/media/media.route");
const payment_routes_1 = require("../modules/payment/payment.routes");
const stripeCEA_routes_1 = require("../modules/stripeCEA/stripeCEA.routes");
const transaction_routes_1 = require("../modules/transaction/transaction.routes");
const artist_routes_1 = require("../modules/artist/artist.routes");
const event_routes_1 = require("../modules/event/event.routes");
const order_routes_1 = require("../modules/order/order.routes");
const contuct_routes_1 = require("../modules/contuct/contuct.routes");
const about_us_route_1 = require("../modules/about/about-us.route");
const refund_policy_route_1 = require("../modules/refundPolicy/refund-policy.route");
const privacy_policy_route_1 = require("../modules/privacy/privacy-policy.route");
const terms_and_conditions_route_1 = require("../modules/terms/terms-and-conditions.route");
const mailAdmin_routes_1 = require("../modules/mailAdmin/mailAdmin.routes");
const dashboard_routes_1 = require("../modules/dashboard/dashboard.routes");
const team_routes_1 = require("../modules/team/team.routes");
const callSession_route_1 = require("../modules/callSession/callSession.route");
const router = express_1.default.Router();
const apiRoutes = [
    {
        path: "/users",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/events",
        route: event_routes_1.eventRoutes,
    },
    {
        path: "/artists",
        route: artist_routes_1.artistRoutes,
    },
    {
        path: "/teams",
        route: team_routes_1.TeamRoutes,
    },
    {
        path: "/orders",
        route: order_routes_1.OrderRoutes,
    },
    {
        path: "/medias",
        route: media_route_1.MediaRoutes,
    },
    {
        path: "/payments",
        route: payment_routes_1.paymentRoutes,
    },
    {
        path: "/stripe-accounts",
        route: stripeCEA_routes_1.stripeCEARoutes,
    },
    {
        path: "/transactions",
        route: transaction_routes_1.transactionRoutes,
    },
    {
        path: "/contacts",
        route: contuct_routes_1.contactRoutes,
    },
    {
        path: "/faqs",
        route: faq_route_1.FaqRoutes,
    },
    {
        path: "/about",
        route: about_us_route_1.AboutUsRoutes,
    },
    {
        path: "/refund-policies",
        route: refund_policy_route_1.RefundPolicyRoutes,
    },
    {
        path: "/privacy",
        route: privacy_policy_route_1.PrivacyRoutes,
    },
    {
        path: "/terms",
        route: terms_and_conditions_route_1.TermsAndConditionsRoutes,
    },
    {
        path: "/mail-admin",
        route: mailAdmin_routes_1.MailAdminRoutes,
    },
    {
        path: "/dashboard",
        route: dashboard_routes_1.DashboardRoutes,
    },
    {
        path: "/call-sessions",
        route: callSession_route_1.callSessionRouters,
    }
];
apiRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
