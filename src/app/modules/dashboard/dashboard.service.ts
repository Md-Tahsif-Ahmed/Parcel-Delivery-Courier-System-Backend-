import { User } from "../user/user.model";
import Transaction from "../payment/transaction.model";
import { EventModel } from "../event/event.model";

const getDashboardData = async (year: number) => {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year + 1, 0, 1);

  const [
    totalRevenue,
    totalTicketsSold,
    totalUsers,
    premiumUsers,
    monthlyRevenue,
    monthlyTicketSales,
  ] = await Promise.all([
    // Total revenue for the year
    Transaction.aggregate([
      {
        $match: {
          status: "succeeded",
          createdAt: { $gte: yearStart, $lt: yearEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),

    // Total tickets sold across events in the year
    EventModel.aggregate([
      {
        $match: {
          eventDate: { $gte: yearStart, $lt: yearEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$ticketSold" } } },
    ]),

    // Total users
    User.countDocuments({ role: "USER" }),

    // Premium users
    User.countDocuments({ isPremium: true }),

    // Monthly revenue by month
    Transaction.aggregate([
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
    EventModel.aggregate([
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
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  const revenueChart = months.map((month, index) => {
    const found = monthlyRevenue.find(m => m._id === index + 1);
    return { month, value: found?.value || 0 };
  });

  const ticketSalesChart = months.map((month, index) => {
    const found = monthlyTicketSales.find(m => m._id === index + 1);
    return { month, value: found?.value || 0 };
  });

  return {
    summary: {
      revenue: totalRevenue[0]?.total || 0,
      ticketsSold: totalTicketsSold[0]?.total || 0,
      users: totalUsers,
      premiumMembers: premiumUsers,
    },
    charts: {
      monthlyRevenue: revenueChart,
      monthlyTicketSales: ticketSalesChart,
    },
  };
};

export const DashboardService = {
  getDashboardData,
};
