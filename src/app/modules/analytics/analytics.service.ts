import { Business } from "../business/business.model";
import { User } from "../user/user.model";

const getDashboardStats = async () => {
  // Total counts
  const totalBusinesses = await Business.countDocuments({ status: true });
  const totalUsers = await User.countDocuments();

  // Businesses by country (top 5)
  const businessesByCountry = await Business.aggregate([
    { $match: { status: true } },
    { $group: { _id: "$country", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $project: { country: "$_id", count: 1, _id: 0 } },
  ]);

  // Businesses by package
  const businessesByPackage = await Business.aggregate([
    { $match: { status: true } },
    { $group: { _id: "$package", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { package: "$_id", count: 1, _id: 0 } },
  ]);

  // Businesses by type
  const businessesByType = await Business.aggregate([
    { $match: { status: true } },
    { $group: { _id: "$typeOfBusiness", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $project: { type: "$_id", count: 1, _id: 0 } },
  ]);

  // Users by role
  const usersByRole = await User.aggregate([
    { $unwind: "$roles" },
    { $group: { _id: "$roles", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { role: "$_id", count: 1, _id: 0 } },
  ]);

  // Recent businesses (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentBusinesses = await Business.countDocuments({
    status: true,
    createdAt: { $gte: sevenDaysAgo },
  });

  // Business growth over last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const businessGrowth = await Business.aggregate([
    {
      $match: {
        status: true,
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        count: 1,
      },
    },
  ]);

  return {
    overview: {
      totalBusinesses,
      totalUsers,
      recentBusinesses,
    },
    businessesByCountry,
    businessesByPackage,
    businessesByType,
    usersByRole,
    businessGrowth,
  };
};

export const AnalyticsServices = {
  getDashboardStats,
};
