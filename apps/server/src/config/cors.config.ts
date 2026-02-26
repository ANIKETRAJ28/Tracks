import { FRONTEND_URL } from './env.config';

export const corsOption = {
  origin: FRONTEND_URL,
  credentials: true,
};
