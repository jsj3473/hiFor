import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  // constructor() {
  //   this.transporter = nodemailer.createTransport({
  //     service: 'gmail', // 사용할 이메일 서비스
  //     auth: {
  //       user: process.env.EMAIL_USER,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //   });
  // }

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.naver.com',       // 네이버 SMTP 서버
      port: 587,                    // SMTP 포트 (SSL 보안 사용 시 465, 아니면 587)
      secure: false,                 // SSL 보안을 사용하므로 true로 설정
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      }
    });
  }

  async sendVerificationCode(email: string, code: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '이메일 인증 코드',
      text: `인증번호는 ${code}입니다.`,
    };
    console.log('user pw',mailOptions.from,mailOptions.to);
    await this.transporter.sendMail(mailOptions);
  }
}
