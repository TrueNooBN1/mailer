// email.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService
  ) {}

  private lastSendTime = 0;
  private readonly MIN_DELAY = 10000; // 10 секунд между письмами!

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Добро пожаловать!',
      template: 'welcome', // имя файла шаблона (welcome.pug)
      context: {
        name,
        siteUrl: process.env.SITE_URL,
      },
    });
  }

  async sendTemplateEmail(to: string, subject: string, template:string, context: any): Promise<void> {
    const now = Date.now();
    const timeSinceLastSend = now - this.lastSendTime;
    
    if (timeSinceLastSend < this.MIN_DELAY) {
      const waitTime = this.MIN_DELAY - timeSinceLastSend;
      console.log(`⏳ Waiting ${waitTime}ms before next email...`);
      await this.sleep(waitTime);
    }
    
    try {
      const result = await this.mailerService.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        template,
        context
      });
      
      this.lastSendTime = Date.now();
      console.log(`✅ Email sent to ${to}`);
      return result;
      
    } catch (error) {
      if (error.message.includes('Try again later')) {
        console.log(`⚠️ Rate limited, waiting 30 seconds...`);
        await this.sleep(30000);
        return this.sendTemplateEmail(to, subject, template, context); // повтор
      }
      throw error;
    }
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendPlainText(to: string, subject: string, text: string): Promise<void> {
    const now = Date.now();
    const timeSinceLastSend = now - this.lastSendTime;
    
    if (timeSinceLastSend < this.MIN_DELAY) {
      const waitTime = this.MIN_DELAY - timeSinceLastSend;
      console.log(`⏳ Waiting ${waitTime}ms before next email...`);
      await this.sleep(waitTime);
    }
    
    try {
      const result = await this.mailerService.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        });
      
      this.lastSendTime = Date.now();
      console.log(`✅ Email sent to ${to}`);
      return result;
      
    } catch (error) {
      if (error.message.includes('Try again later')) {
        console.log(`⚠️ Rate limited, waiting 30 seconds...`);
        await this.sleep(30000);
        return this.sendPlainText(to, subject, text); // повтор
      }
      throw error;
    }
  }

  // async sendHtml(to: string, subject: string, html: string): Promise<void> {
  //   await this.mailerService.sendMail({
  //     to,
  //     subject,
  //     html,
  //   });
  // }
}