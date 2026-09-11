# David & Diana Wedding

Mobile-first wedding invitation for David & Diana — 24 September 2026.

## Current flow

- Guest opens the invitation gate.
- The camera checks for a smile held for three seconds.
- The invitation opens and attempts to start the surprise video with sound automatically.
- If the browser blocks audible autoplay, a visible sound button appears immediately.
- RSVP records the guest name, attendance choice, and companion count.
- Wedding Drop and voice messages can upload to Google Drive after the backend endpoint is configured; otherwise the device share fallback remains available.

## Google Drive backend

The repository includes the ready-to-deploy Apps Script in google-apps-script/Code.gs. It writes RSVP responses to the existing spreadsheet and stores photos, videos, and voice messages in the existing Drive folders.

One-time setup:

1. Open script.google.com using the wedding Google account.
2. Create a new project and paste the contents of google-apps-script/Code.gs.
3. Deploy it as a Web app, execute as your account, with access set to anyone.
4. Copy the Web app URL into both rsvpEndpoint and uploadEndpoint in config.js, or put it in backendEndpoint.
5. Commit the updated config.js to the repository.

The script uses the existing IDs already recorded in config.js. Do not put Google passwords, API keys, or private tokens in the website.

## Hosting

GitHub Pages publishes the main branch at https://mino-87.github.io/wedding/.
