/**
 * Vedant Nature's Nest — website enquiries to Google Sheets.
 * Paste this into Extensions → Apps Script of your Google Sheet, then deploy it as a web app.
 * Full steps: google-sheet/README.md
 */

// Tab the enquiries go into (created automatically on the first enquiry).
const SHEET_NAME = 'Enquiries';

// Optional: an email address to notify on every new enquiry, e.g. 'sales@yourdomain.com'. Leave '' for none.
const NOTIFY_EMAIL = '';

const HEADERS = ['Received', 'Name', 'Mobile', 'Email', 'Interested in', 'Preferred visit date', 'Message', 'Form', 'Page'];

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Ignore spam: bots fill the hidden "website" field; real enquiries always have a name and a 10-digit mobile.
  const phone = String(p.phone || '').replace(/\D/g, '');
  if (p.website || !String(p.name || '').trim() || !/^[6-9]\d{9}$/.test(phone)) {
    return reply({ ok: false });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    const row = [
      new Date(),
      clean(p.name),
      "'" + phone, // keep the number as text so the sheet doesn't reformat it
      clean(p.email),
      clean(p.configuration),
      clean(p.visit_date),
      clean(p.message),
      clean(p.type),
      clean(p.page),
    ];
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, 'New website enquiry: ' + row[1],
        HEADERS.slice(1).map((h, i) => h + ': ' + String(row[i + 1]).replace(/^'/, '')).join('\n'));
    }
  } finally {
    lock.releaseLock();
  }
  return reply({ ok: true });
}

// Lets you open the web app URL in a browser to check it is live.
function doGet() {
  return reply({ ok: true, message: 'Vedant enquiries endpoint is running.' });
}

// Trim, cap the length, and stop text from being read as a spreadsheet formula.
function clean(value) {
  const text = String(value || '').trim().slice(0, 1000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
