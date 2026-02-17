export const calculateServiceFee = (user: any, subtotal: number) => {
  if (user?.isPremium) return 0;
  return Math.round(subtotal * 0.08); // 8% service fee for non-premium users
};

