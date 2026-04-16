// E-Mail Templates für Photo Aigner

interface BookingData {
  name?: string;
  date?: string;
  location?: string;
  service?: string;
  email?: string;
}

interface EquipmentItem {
  id: string;
  name: string;
  type: string;
}

// Template: Buchungsbestätigung
export function confirmationTemplate(booking: BookingData): { subject: string; html: string; text: string } {
  const formattedDate = formatDate(booking.date);
  
  return {
    subject: `Buchungsbestätigung: ${booking.service || 'Ihr Termin'} am ${formattedDate}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background: #f5f3ef; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a1a1a, #2d2d2d); color: #faf8f5; padding: 40px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 0.02em; }
    .gold-bar { height: 4px; background: linear-gradient(90deg, #c9a962, #d4af55); }
    .content { padding: 40px; }
    .greeting { font-size: 18px; color: #1a1a1a; margin-bottom: 24px; }
    .details-box { background: #f5f3ef; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .detail-row { display: flex; margin-bottom: 12px; }
    .detail-label { color: #666; min-width: 100px; font-size: 14px; }
    .detail-value { font-weight: 500; color: #1a1a1a; }
    .highlight { background: linear-gradient(135deg, #c9a962, #d4af55); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0; }
    .footer { background: #f5f3ef; padding: 30px; text-align: center; font-size: 13px; color: #666; }
    .footer a { color: #c9a962; text-decoration: none; }
    .social-icon { display: inline-block; margin: 0 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Photo Aigner</h1>
    </div>
    <div class="gold-bar"></div>
    <div class="content">
      <p class="greeting">Liebe/r ${booking.name || 'Kunde/in'},</p>
      
      <p>vielen Dank für Ihre Buchung! Wir freuen uns sehr, Ihren besonderen Moment festhalten zu dürfen.</p>
      
      <div class="details-box">
        <h3 style="margin-top: 0; color: #c9a962;">📋 Ihre Buchungsdetails</h3>
        <div class="detail-row">
          <span class="detail-label">📅 Datum:</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        ${booking.location ? `
        <div class="detail-row">
          <span class="detail-label">📍 Location:</span>
          <span class="detail-value">${booking.location}</span>
        </div>
        ` : ''}
        ${booking.service ? `
        <div class="detail-row">
          <span class="detail-label">🎬 Leistung:</span>
          <span class="detail-value" style="text-transform: capitalize;">${booking.service}</span>
        </div>
        ` : ''}
      </div>
      
      <div class="highlight">
        <strong>Ihr Termin ist bestätigt! ✓</strong>
      </div>
      
      <p>Bei Fragen stehe ich Ihnen jederzeit gerne zur Verfügung.</p>
      
      <p style="margin-top: 30px;">
        Mit herzlichen Grüßen<br>
        <strong>Ihr Tobias Aigner</strong><br>
        <span style="color: #c9a962;">Photo Aigner</span>
      </p>
    </div>
    <div class="footer">
      <p>
        <a href="https://photo-aigner.at">www.photo-aigner.at</a> |
        <a href="mailto:office@photo-aigner.at">office@photo-aigner.at</a>
      </p>
      <p style="margin-top: 16px;">
        <a href="https://instagram.com/photo.aigner" class="social-icon">📸 Instagram</a>
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Liebe/r ${booking.name || 'Kunde/in'},

vielen Dank für Ihre Buchung! Wir freuen uns sehr, Ihren besonderen Moment festhalten zu dürfen.

IHRE BUCHUNGSDETAILS:
- Datum: ${formattedDate}
${booking.location ? `- Location: ${booking.location}` : ''}
${booking.service ? `- Leistung: ${booking.service}` : ''}

Ihr Termin ist bestätigt! ✓

Bei Fragen stehe ich Ihnen jederzeit gerne zur Verfügung.

Mit herzlichen Grüßen
Ihr Tobias Aigner
Photo Aigner

www.photo-aigner.at | office@photo-aigner.at
    `
  };
}

// Template: Reminder
export function reminderTemplate(booking: BookingData, daysUntil: number): { subject: string; html: string; text: string } {
  const formattedDate = formatDate(booking.date);
  
  return {
    subject: `Erinnerung: ${booking.service || 'Ihr Termin'} in ${daysUntil} Tagen`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background: #f5f3ef; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a1a1a, #2d2d2d); color: #faf8f5; padding: 40px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
    .gold-bar { height: 4px; background: linear-gradient(90deg, #c9a962, #d4af55); }
    .content { padding: 40px; }
    .countdown { font-size: 48px; color: #c9a962; text-align: center; margin: 20px 0; font-weight: 300; }
    .countdown-label { text-align: center; color: #666; margin-bottom: 30px; }
    .details-box { background: #f5f3ef; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .footer { background: #f5f3ef; padding: 30px; text-align: center; font-size: 13px; color: #666; }
    .footer a { color: #c9a962; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Photo Aigner</h1>
    </div>
    <div class="gold-bar"></div>
    <div class="content">
      <p>Liebe/r ${booking.name || 'Kunde/in'},</p>
      
      <div class="countdown">⏰ ${daysUntil}</div>
      <p class="countdown-label">Tage bis zu Ihrem Termin</p>
      
      <div class="details-box">
        <h3 style="margin-top: 0; color: #c9a962;">📋 Termindetails</h3>
        <p><strong>📅 Datum:</strong> ${formattedDate}</p>
        ${booking.location ? `<p><strong>📍 Location:</strong> ${booking.location}</p>` : ''}
        ${booking.service ? `<p><strong>🎬 Leistung:</strong> ${booking.service}</p>` : ''}
      </div>
      
      <p>Ich freue mich schon sehr auf unser Shooting!</p>
      
      <p style="margin-top: 30px;">
        Bis bald<br>
        <strong>Tobias Aigner</strong>
      </p>
    </div>
    <div class="footer">
      <a href="https://photo-aigner.at">www.photo-aigner.at</a>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Liebe/r ${booking.name || 'Kunde/in'},

Nur noch ${daysUntil} Tage bis zu Ihrem Termin!

TERMINDETAILS:
- Datum: ${formattedDate}
${booking.location ? `- Location: ${booking.location}` : ''}
${booking.service ? `- Leistung: ${booking.service}` : ''}

Ich freue mich schon sehr auf unser Shooting!

Bis bald
Tobias Aigner
Photo Aigner
    `
  };
}

// Template: Dankeschön
export function thankYouTemplate(booking: BookingData): { subject: string; html: string; text: string } {
  const formattedDate = formatDate(booking.date);
  
  return {
    subject: `Danke für Ihr Vertrauen! - ${booking.service || 'Ihr Shooting'}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background: #f5f3ef; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a1a1a, #2d2d2d); color: #faf8f5; padding: 40px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
    .gold-bar { height: 4px; background: linear-gradient(90deg, #c9a962, #d4af55); }
    .content { padding: 40px; }
    .heart { font-size: 48px; text-align: center; margin: 20px 0; }
    .review-box { background: linear-gradient(135deg, #c9a962, #d4af55); color: white; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0; }
    .review-box a { color: white; text-decoration: none; font-weight: bold; }
    .footer { background: #f5f3ef; padding: 30px; text-align: center; font-size: 13px; color: #666; }
    .footer a { color: #c9a962; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Photo Aigner</h1>
    </div>
    <div class="gold-bar"></div>
    <div class="content">
      <div class="heart">💛</div>
      
      <p>Liebe/r ${booking.name || 'Kunde/in'},</p>
      
      <p>es war mir eine große Freude, ${booking.date ? `am ${formattedDate}` : ''} für Sie da zu sein! 
      Ich hoffe, Sie haben wunderschöne Erinnerungen von diesem besonderen Tag.</p>
      
      <p>An Ihren Bildern${booking.service?.toLowerCase() === 'hochzeit' ? ' und Ihrem Film' : ''} arbeite ich bereits mit viel Liebe zum Detail.</p>
      
      <div class="review-box">
        <p style="margin: 0 0 10px 0;">War ich eine Empfehlung wert?</p>
        <p style="margin: 0;">Eine Google-Bewertung würde mich sehr freuen! ⭐⭐⭐⭐⭐</p>
      </div>
      
      <p>Vielen Dank für Ihr Vertrauen!</p>
      
      <p style="margin-top: 30px;">
        Herzliche Grüße<br>
        <strong>Tobias Aigner</strong><br>
        <span style="color: #c9a962;">Photo Aigner</span>
      </p>
    </div>
    <div class="footer">
      <p>
        <a href="https://photo-aigner.at">www.photo-aigner.at</a> |
        <a href="https://instagram.com/photo.aigner">📸 Instagram</a>
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Liebe/r ${booking.name || 'Kunde/in'},

💛 Vielen Dank!

Es war mir eine große Freude, ${booking.date ? `am ${formattedDate}` : ''} für Sie da zu sein!
Ich hoffe, Sie haben wunderschöne Erinnerungen von diesem besonderen Tag.

An Ihren Bildern${booking.service?.toLowerCase() === 'hochzeit' ? ' und Ihrem Film' : ''} arbeite ich bereits mit viel Liebe zum Detail.

War ich eine Empfehlung wert? Eine Google-Bewertung würde mich sehr freuen! ⭐⭐⭐⭐⭐

Herzliche Grüße
Tobias Aigner
Photo Aigner

www.photo-aigner.at
    `
  };
}

// Template: Packliste
export function packlistTemplate(
  booking: BookingData, 
  equipmentItems: EquipmentItem[],
  droneDisclaimer?: string
): { subject: string; html: string; text: string } {
  const formattedDate = formatDate(booking.date);
  
  // Group equipment by type
  const grouped = equipmentItems.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, EquipmentItem[]>);

  const equipmentHtml = Object.entries(grouped).map(([type, items]) => `
    <div style="margin-bottom: 16px;">
      <h4 style="color: #c9a962; margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">${type}</h4>
      ${items.map(item => `
        <div style="padding: 8px 12px; background: #f5f3ef; border-radius: 6px; margin-bottom: 4px; font-size: 14px;">
          ✓ ${item.name}
        </div>
      `).join('')}
    </div>
  `).join('');

  const equipmentText = Object.entries(grouped).map(([type, items]) => 
    `${type.toUpperCase()}:\n${items.map(item => `  ✓ ${item.name}`).join('\n')}`
  ).join('\n\n');

  return {
    subject: `Ihre ${booking.service || 'Reportage'} am ${formattedDate} - Wir sind bereit!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background: #f5f3ef; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a1a1a, #2d2d2d); color: #faf8f5; padding: 40px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
    .gold-bar { height: 4px; background: linear-gradient(90deg, #c9a962, #d4af55); }
    .content { padding: 40px; }
    .ready-badge { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 16px 24px; border-radius: 12px; text-align: center; margin: 24px 0; font-size: 18px; }
    .equipment-box { background: white; border: 2px solid #e5e3df; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .details-box { background: #f5f3ef; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .disclaimer { background: rgba(201, 169, 98, 0.1); border: 1px solid #c9a962; border-radius: 8px; padding: 16px; margin: 24px 0; font-size: 13px; color: #666; }
    .footer { background: #f5f3ef; padding: 30px; text-align: center; font-size: 13px; color: #666; }
    .footer a { color: #c9a962; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Photo Aigner</h1>
    </div>
    <div class="gold-bar"></div>
    <div class="content">
      <p>Liebe/r ${booking.name || 'Kunde/in'},</p>
      
      <p>Ihr großer Tag rückt näher! Ich möchte Ihnen versichern: <strong>Wir sind bestens vorbereitet!</strong></p>
      
      <div class="ready-badge">
        🎬 Alles bereit für Ihren Termin!
      </div>
      
      <div class="details-box">
        <h3 style="margin-top: 0; color: #c9a962;">📋 Termindetails</h3>
        <p><strong>📅 Datum:</strong> ${formattedDate}</p>
        ${booking.location ? `<p><strong>📍 Location:</strong> ${booking.location}</p>` : ''}
        ${booking.service ? `<p><strong>🎬 Leistung:</strong> ${booking.service}</p>` : ''}
      </div>
      
      <div class="equipment-box">
        <h3 style="margin-top: 0; color: #1a1a1a; display: flex; align-items: center; gap: 8px;">
          🎥 Equipment-Packliste
        </h3>
        ${equipmentHtml}
      </div>
      
      ${droneDisclaimer ? `
      <div class="disclaimer">
        ${droneDisclaimer}
      </div>
      ` : ''}
      
      <p>Sollten Sie noch Fragen haben oder besondere Wünsche, melden Sie sich gerne jederzeit!</p>
      
      <p style="margin-top: 30px;">
        Ich freue mich auf Sie!<br>
        <strong>Tobias Aigner</strong><br>
        <span style="color: #c9a962;">Photo Aigner</span>
      </p>
    </div>
    <div class="footer">
      <p>
        <a href="https://photo-aigner.at">www.photo-aigner.at</a> |
        <a href="mailto:office@photo-aigner.at">office@photo-aigner.at</a>
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Liebe/r ${booking.name || 'Kunde/in'},

Ihr großer Tag rückt näher! Ich möchte Ihnen versichern: Wir sind bestens vorbereitet!

🎬 Alles bereit für Ihren Termin!

TERMINDETAILS:
- Datum: ${formattedDate}
${booking.location ? `- Location: ${booking.location}` : ''}
${booking.service ? `- Leistung: ${booking.service}` : ''}

EQUIPMENT-PACKLISTE:
${equipmentText}

${droneDisclaimer ? `\n${droneDisclaimer}\n` : ''}

Sollten Sie noch Fragen haben oder besondere Wünsche, melden Sie sich gerne jederzeit!

Ich freue mich auf Sie!
Tobias Aigner
Photo Aigner

www.photo-aigner.at | office@photo-aigner.at
    `
  };
}

// Helper: Format date to German format
function formatDate(dateStr?: string): string {
  if (!dateStr) return 'TBD';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    
    return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export type TemplateType = 'confirmation' | 'reminder' | 'thankyou' | 'packlist';

export function getTemplateForType(
  type: TemplateType, 
  booking: BookingData, 
  options?: { daysUntil?: number; equipment?: EquipmentItem[]; droneDisclaimer?: string }
): { subject: string; html: string; text: string } {
  switch (type) {
    case 'confirmation':
      return confirmationTemplate(booking);
    case 'reminder':
      return reminderTemplate(booking, options?.daysUntil || 7);
    case 'thankyou':
      return thankYouTemplate(booking);
    case 'packlist':
      return packlistTemplate(booking, options?.equipment || [], options?.droneDisclaimer);
    default:
      return confirmationTemplate(booking);
  }
}
