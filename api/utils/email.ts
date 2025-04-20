import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import logger from '../../logs/logger';
dotenv.config()

// Create reusable transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/user/verify/${token}`;

  // console.log('\n=== Email Configuration ===');
  // console.log('Sending verification email to:', email);
  // console.log('Verification URL:', verificationUrl);
  // console.log('Using email account:', process.env.EMAIL_USER);
  // console.log('========================\n');

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Welcome!</h1>
              <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
              <a href="${verificationUrl}" 
                style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;"
              >
                  Verify Email
              </a>
              <p style="color: #666;">Or copy and paste this URL into your browser:</p>
              <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
              <p style="color: #999; font-size: 0.9em; margin-top: 20px;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
            `
    });
    logger.info('Email sent successfully: ' + info.messageId);
  } catch (error) {
    logger.error('Failed to send email: ' + error as string);
    throw error;
  }
}