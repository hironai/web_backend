const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const search = require("../../models/search");

// Generates and Send OTP to email queue service
exports.valideSearchLimit = catchAsyncErrors(async (userId) => {
  // 📅 Get today's start & end timestamps
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // 🔍 Count Today's Searches
  const todaySearchCount = await search.countDocuments({
      user: userId,
      isAISearch: false,
      createdAt: { $gte: todayStart, $lte: todayEnd }
  });

  // 🔍 Count AI Searches for Today
  const todayAISearchCount = await search.countDocuments({
      user: userId,
      isAISearch: true,
      createdAt: { $gte: todayStart, $lte: todayEnd }
  });

  return {todaySearchCount, todayAISearchCount}
    
});