# Connect the enquiry form to Google Sheets

Every site-visit enquiry from the project page is added as a new row in a Google Sheet:
received time, name, mobile, email, flat type, preferred visit date, message, form and page.

One-time setup, about 5 minutes. Do it while signed in to the Google account that should own the leads
(for example vedantdevelopersandbuilders@gmail.com).

1. Go to [sheets.new](https://sheets.new) to create a sheet. Name it, e.g. **Vedant Website Enquiries**.
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the sample code, paste in everything from [`Code.gs`](Code.gs), and click **Save**.
   - Optional: put an email address in `NOTIFY_EMAIL` to get an email for every enquiry.
4. Click **Deploy → New deployment**. Click the gear next to "Select type" and choose **Web app**.
   - Description: `Website enquiries`
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, then **Authorize access**, choose your account and allow it.
   Google may warn that the app isn't verified: click **Advanced → Go to (project name)**. This is your own script.
6. Copy the **Web app URL** (it ends in `/exec`).
7. Open `js/main.js`, find `const GOOGLE_SHEET_URL` and paste the URL between the quotes (already done for the current sheet):
   ```js
   const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/XXXXXXXX/exec';
   ```
8. Publish the site, submit a test enquiry, and check the **Enquiries** tab in your sheet.

To check the script is live, open the Web app URL in a browser: it should show
`{"ok":true,"message":"Vedant enquiries endpoint is running."}`.

## If you change `Code.gs` later

Use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**.
This keeps the same URL, so the website doesn't need changing.

## Notes

- "Who has access: Anyone" lets the website send rows; it doesn't let anyone read your sheet.
- Spam protection: a hidden field that only bots fill in, plus a check for a name and a valid 10-digit Indian mobile number.
- Until the URL is filled in, the form still shows the thank-you message and the "Continue on WhatsApp" button, but nothing is saved.
