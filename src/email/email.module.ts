// email.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { PugAdapter } from '@nestjs-modules/mailer/adapters/pug.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        
        transport: {
          host: config.get('EMAIL_HOST'),
          port: config.get('EMAIL_PORT'),
          secure: config.get('EMAIL_SECURE') === 'true',
          auth: {
            user: config.get('EMAIL_USER'),
            pass: config.get('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"${config.get('EMAIL_FROM_NAME')}" <${config.get('EMAIL_FROM')}>`,
        },
        // template: {
        //   dir: join(__dirname,'..', 'templates'),
        //   adapter: new PugAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService], // экспортируем сервис для использования в других модулях
})
export class EmailModule {}