import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  private mailOptions;

  constructor() {
    // SMTP 설정
    this.transporter = nodemailer.createTransport({
      host: 'smtp.naver.com', // 네이버 SMTP 서버
      port: 587, // SMTP 포트 (SSL 보안 사용 시 465, 아니면 587)
      secure: false, // SSL 보안 여부
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // 전역 mailOptions 기본 설정
    this.mailOptions = {
      from: process.env.EMAIL_USER, // 발신자 이메일 주소
    };
  }

  // 이메일 인증 코드 전송 메서드
  async sendVerificationCode(email: string, code: string) {
    const mailOptions = {
      ...this.mailOptions,
      to: email, // 수신자 이메일 주소
      subject: '이메일 인증 코드',
      text: `인증번호는 ${code}입니다.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`인증 코드 이메일이 ${email}로 전송되었습니다.`);
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      throw new Error('이메일 전송에 실패했습니다.');
    }
  }

  // 비밀번호 초기화 이메일 전송 메서드
  async sendResetPasswordEmail(recipientEmail: string, newPassword: string): Promise<void> {
    const mailOptions = {
      ...this.mailOptions,
      to: recipientEmail, // 수신자 이메일 주소
      subject: '비밀번호 초기화 안내',
      text: `임시 비밀번호: ${newPassword}\n로그인 후 비밀번호를 변경해 주세요.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`임시 비밀번호 이메일이 ${recipientEmail}로 전송되었습니다.`);
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      throw new Error('이메일 전송에 실패했습니다.');
    }
  }
}
