import config from 'config';
import nodemailer from 'nodemailer';

export interface Email {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export interface Emailer {
  send(email: Email): Promise<Email>;
}

class NodemailerEmailer implements Emailer {
  async send(email: Email): Promise<Email> {
    const result = await emailTransporter.sendMail(email);
    return result;
  }
}

export const emailer = new NodemailerEmailer();

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  password: string;
}

const smtpConfig: SmtpConfig = config.get('smtp');

function createTransport(): nodemailer.Transporter {
  return nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.password,
    },
  });
}

export const emailTransporter = createTransport();