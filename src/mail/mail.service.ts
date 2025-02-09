import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
// 이메일 전송에 필요한 데이터 타입 정의
export interface CreateParticipantEmailData {
  hostName: string;      // 호스트 이름
  eventTitle: string;    // 이벤트 제목
  eventDate: string;     // 이벤트 날짜 (필요 시 포맷 변환 고려)
  eventLocation: string; // 이벤트 장소
  participantName: string; // 참가자 이름
  eventId: number;       // 이벤트 ID (관리 페이지 링크 생성용)
}
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
  async sendContactEmail(
    title: string,
    phone: string,
    email: string,
    message: string,
    file?: Express.Multer.File,
  ): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      ...this.mailOptions,
      from: process.env.EMAIL_USER, // 발신자 이메일
      to: process.env.EMAIL_USER, // 수신자 이메일 (자기 자신에게 보냄)
      subject: `문의: ${title}`,
      text: `문의 내용:\n\n
      제목: ${title}\n
      휴대전화: ${phone}\n
      이메일: ${email}\n
      메시지:\n${message}\n
      `,
      attachments: file
        ? [
          {
            filename: file.originalname,
            content: Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer), // Buffer 변환
          },
        ]
        : [],
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('문의 이메일 전송 실패:', error);
      throw new Error('문의 이메일 전송에 실패했습니다.');
    }
  }
  // 승인 이메일 전송 메서드
  async sendApprovedEmail(
    recipientEmail: string,
    emailData: {
      guestName: string;
      eventTitle: string;
      eventDate: string;
      eventLocation: string;
      eventId: number;
    },
  ): Promise<void> {
    const { guestName, eventTitle, eventDate, eventLocation, eventId } = emailData;
    const mailOptions = {
      ...this.mailOptions,
      to: recipientEmail,
      subject: '[HiFor] Your event participation is approved!',
      // HTML 템플릿(텍스트 템플릿도 가능)
      html: `
        <p>Hello ${guestName},</p>
        <p>Great news! Your participation for the event has been approved.</p>
        <p>
          <strong>Event:</strong> ${eventTitle}<br/>
          <strong>Date:</strong> ${eventDate}<br/>
          <strong>Location:</strong> ${eventLocation}
        </p>
        <p>You're all set! See you at the event.</p>
        <br>
        <p>
          <a href="http://localhost:8080/gathering/${eventId}" style="padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none;">View Event Details</a>
        </p>
        <br>
        <p>Best,<br/>The HiFor Team</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Approved email sent to ${recipientEmail}`);
    } catch (error) {
      console.error('Error sending approved email:', error);
      throw new Error('Error sending approved email');
    }
  }

  // 거절 이메일 전송 메서드
  async sendRejectedEmail(
    recipientEmail: string,
    emailData: { guestName: string; eventTitle: string },
  ): Promise<void> {
    const { guestName, eventTitle } = emailData;
    const mailOptions = {
      ...this.mailOptions,
      to: recipientEmail,
      subject: '[HiFor] Your event application was declined',
      html: `
        <p>Hello ${guestName},</p>
        <p>Unfortunately, your application for <strong>${eventTitle}</strong> was not approved this time.</p>
        <p>Don't worry—there are plenty of other events waiting for you on HiFor.</p>
        <br>
        <p>
          <a href="http://localhost:8080/allEvents" style="padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none;">Find Other Events</a>
        </p>
        <br>
        <p>Best,<br/>The HiFor Team</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Rejected email sent to ${recipientEmail}`);
    } catch (error) {
      console.error('Error sending rejected email:', error);
      throw new Error('Error sending rejected email');
    }
  }

  async sendCreatePartiEmail(
    recipientEmail: string,
    data: CreateParticipantEmailData,
  ): Promise<void> {
    const { hostName, eventTitle, eventDate, eventLocation, participantName, eventId } = data;

    // 메일 제목
    const subject = '[HiFor] A new participant has signed up!';

    // 관리 페이지 링크 (프로덕션 URL에 맞게 수정)
    const manageEventUrl = `http://localhost:8080/gathering/${eventId}`;

    // HTML 포맷의 메일 본문 작성
    const htmlContent = `
      <p>Hello ${hostName},</p>
      <p>A new participant has just signed up for your event!</p>
      <p><strong>Event:</strong> ${eventTitle}</p>
      <p><strong>Participant:</strong> ${participantName}</p>
      <p>You can now approve or decline their request. Check your event dashboard and welcome your new member!</p>
      <br>
      <p>
        <a 
          href="${manageEventUrl}" 
          style="display:inline-block;padding:10px 15px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;"
        >
          Manage Event
        </a>
      </p>
      <br>
      <p>Best,<br/>The HiFor Team</p>
    `;

    // 메일 옵션 설정
    const mailOptions = {
      ...this.mailOptions,
      to: recipientEmail,
      subject,
      html: htmlContent,
    };

    // 메일 전송
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${recipientEmail}`);
    } catch (error) {
      console.error('Error sending create participant email:', error);
      throw error;
    }
  }

  async sendEventDeletionEmail(email: string, reason: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email, // 수신자 이메일
        subject: 'Event Deletion Notification',
        text: `The event you were registered for has been deleted for the following reason:\n\n${reason}\n\nWe apologize for the inconvenience.`,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email.');
    }
  }
}
