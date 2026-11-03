export const checkCouponDateValidity = (couponData: any, currentDate: Date) => {
  const { dateType, startDate, endDate, singleDate } = couponData;

  if (dateType === "Single" && singleDate) {
    return singleDate <= currentDate;
  }

  if (dateType === "Range" && startDate && endDate) {
    return startDate <= currentDate && currentDate <= endDate;
  }

  return true; // Unlimited - always valid
};
