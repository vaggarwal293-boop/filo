// ============================================================
//  Space Philic — Google Apps Script (Contact Form → Sheet + Email)
// ============================================================
//
//  SETUP INSTRUCTIONS:
//  1. Open Google Sheets → create a new spreadsheet
//  2. Name the first sheet "Leads" (or keep "Sheet1" and update SHEET_NAME below)
//  3. Add these headers in Row 1:
//     A1: Timestamp | B1: Name | C1: Email | D1: Company | E1: Message
//  4. Go to Extensions → Apps Script
//  5. Delete any code in Code.gs and paste this entire file
//  6. Save (Ctrl+S)
//  7. Click Deploy → New deployment
//     - Type: Web app
//     - Execute as: Me
//     - Who has access: Anyone
//  8. Click Deploy → Authorize when prompted
//  9. Copy the Web App URL
// 10. Paste that URL into index.html replacing 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'
//
//  That's it! Form submissions will now:
//   ✓ Append a row to your Google Sheet
//   ✓ Send an email notification to NOTIFY_EMAIL
// ============================================================

const SHEET_NAME = 'Leads';                       // Name of the sheet tab
const NOTIFY_EMAIL = 'indra.chaudhary@spacephilic.com';   // Where to send email alerts

// ── Handle POST requests from the contact form ──
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // 1. Append to Google Sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name    || '',
      data.email   || '',
      data.company || '',
      data.message || ''
    ]);

    // 2. Send email notification
    const subject = `New Lead: ${data.name} from ${data.company || 'N/A'}`;
    const body = [
      `New contact form submission on spacephilic.com`,
      ``,
      `Name:    ${data.name}`,
      `Email:   ${data.email}`,
      `Company: ${data.company || 'N/A'}`,
      `Message:`,
      `${data.message}`,
      ``,
      `---`,
      `Received: ${data.timestamp || new Date().toISOString()}`
    ].join('\n');

    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    // 3. Return success
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Handle GET requests (optional health check) ──
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: 'Space Philic Contact Form' }))
    .setMimeType(ContentService.MimeType.JSON);
}
