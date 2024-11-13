import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer'; 

@Injectable()
export class AlertService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<number>('EMAIL_PORT') === 465,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendPriceAlert(email: string, chain: string, price: number) {
    const mailOptions = {
      from: `"Price Tracker" <${this.configService.get<string>('EMAIL_USER')}>`,
      to: email,
      subject: `Price Alert: ${chain}`,
      text: `The price of ${chain} has reached $${price}.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Price alert sent to ${email}`);
    } catch (error) {
      console.error('Error sending price alert email:', error);
    }
  }
}
