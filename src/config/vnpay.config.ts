import { registerAs } from '@nestjs/config';

export default registerAs('vnpay', () => ({
  vnp_TmnCode: process.env.VNP_TMN_CODE || '',
  vnp_HashSecret: process.env.VNP_HASH_SECRET || '',
  vnp_Url: process.env.VNP_URL || '',
  vnp_ReturnUrl: process.env.VNP_RETURN_URL || '',
  timeLimit: process.env.TIME_LIMIT, // phút
}));
