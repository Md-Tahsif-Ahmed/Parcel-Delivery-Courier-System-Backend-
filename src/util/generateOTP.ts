// const generateOTP = () => {
//   return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
// };

// export default generateOTP;

import crypto from "crypto";

const generateOTP = (): number => {
  return crypto.randomInt(1000, 10000);
};

export default generateOTP;
