import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// SMTP Configuration
const transporter = nodemailer.createTransport({
  host: 'mail.gaeb-station.at',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: 'clawd@gaeb-station.at',
    pass: 'Brutus_Clawd_2026!',
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, text, html, replyTo } = body;

    if (!to || !subject) {
      return NextResponse.json(
        { error: 'Empfänger und Betreff sind erforderlich' },
        { status: 400 }
      );
    }

    if (!text && !html) {
      return NextResponse.json(
        { error: 'Nachricht (text oder html) ist erforderlich' },
        { status: 400 }
      );
    }

    const mailOptions = {
      from: '"Photo Aigner" <clawd@gaeb-station.at>',
      to,
      subject,
      text: text || '',
      html: html || undefined,
      replyTo: replyTo || 'office@photo-aigner.at',
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'E-Mail erfolgreich gesendet',
    });
  } catch (error) {
    console.error('E-Mail-Fehler:', error);
    return NextResponse.json(
      { error: 'E-Mail konnte nicht gesendet werden', details: String(error) },
      { status: 500 }
    );
  }
}

// Test SMTP connection
export async function GET() {
  try {
    await transporter.verify();
    return NextResponse.json({
      success: true,
      message: 'SMTP-Verbindung erfolgreich',
    });
  } catch (error) {
    console.error('SMTP-Test fehlgeschlagen:', error);
    return NextResponse.json(
      { error: 'SMTP-Verbindung fehlgeschlagen', details: String(error) },
      { status: 500 }
    );
  }
}
