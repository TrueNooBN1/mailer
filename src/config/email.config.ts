import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10) || 465,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  defaults: {
    from: `"${process.env.EMAIL_FROM_NAME || 'App'}" <${process.env.EMAIL_FROM || 'noreply@example.com'}>`,
  },
}));