# Receiving contact-form submissions

Your contact form is live at [contact.html](contact.html), but until
you complete a 3-step setup, it shows a "Form not yet configured"
warning instead of sending submissions anywhere.

This is because **GitHub Pages serves only static files** - there's
no server to receive the POST request. So the form needs a free
third-party "form relay" that catches submissions and forwards them
to your inbox.

Three good options below - pick whichever fits. **Web3Forms is
recommended** because it's free with no signup, and submissions land
straight in your email.

---

## ✅ Option 1 - Web3Forms (recommended, free, no signup)

### Setup (3 minutes, one-time)

1. Visit **[web3forms.com](https://web3forms.com)**.
2. Scroll to "Get your Access Key", enter **`info@brahmkshatriya.org`**
   (or whichever inbox you want submissions delivered to), and click
   *Create Access Key*.
3. Check that inbox for the access key - a long string like
   `a1b2c3d4-e5f6-7890-abcd-ef1234567890`.
4. Open [contact.html](contact.html) and find this line:
   ```html
   <input type="hidden" name="access_key" value="YOUR-WEB3FORMS-ACCESS-KEY-HERE" />
   ```
   Replace `YOUR-WEB3FORMS-ACCESS-KEY-HERE` with the key from step 3.
5. Run `./bump-version.sh`, commit and push.

### How it feels for visitors

- They fill the form → click Send.
- Button shows "Sending…", then "✓ Thank you! Your message has been
  received. We will reply soon."
- The form clears for the next person.

### How it feels for you

- Each submission arrives in `info@brahmkshatriya.org` within seconds.
- The email subject is "New message from brahmakshatriyahitechchhu.org".
- The body contains the visitor's name, email, phone (if any) and message.
- You can reply directly from your email client - the visitor's email
  is set as the Reply-To address.

### Costs and limits

- **Free** for up to 250 submissions/month.
- No credit card. No signup beyond getting the key.
- Custom subject + reply-to + auto-response are all configurable in
  the form's hidden fields.

### Bonus features already wired in

- **Spam honeypot** - a hidden checkbox that real users won't tick;
  bots that fill every field get silently rejected.
- **Auto subject line** so your inbox stays organised.

---

## 🔵 Option 2 - Formspree (more dashboard features, free tier)

Use this if you want to view all submissions in a web dashboard,
forward them to multiple emails, or set up email autoresponders.

### Setup

1. Sign up at **[formspree.io](https://formspree.io)** (free tier).
2. *Verify your email* and create a new form.
3. Copy the form's unique endpoint URL - looks like
   `https://formspree.io/f/abcdwxyz`.
4. Open [contact.html](contact.html) and:
   - Change the form's `action` from
     `https://api.web3forms.com/submit` to your Formspree URL.
   - Delete the hidden `access_key`, `subject`, `from_name` inputs
     (Formspree configures these in its dashboard instead).
5. Run `./bump-version.sh`, commit and push.

### Costs and limits

- **Free** for up to 50 submissions/month.
- Paid plans ($10+/month) add unlimited submissions, file uploads,
  Slack integration, etc.

---

## 🟢 Option 3 - Google Forms (responses in a Google Sheet)

Use this if you want responses in a **Google Sheet** for sorting,
filtering and bulk export - handy if you handle many enquiries.

### Setup

1. Go to **[forms.google.com](https://forms.google.com)** and create
   a new form with the same fields (Name, Email, Phone, Message).
2. Click *Responses* → the green Sheets icon → "Create spreadsheet"
   so submissions automatically land in a Google Sheet.
3. Click *Send* → click the **`<>`** (embed) icon → copy the iframe.
4. Replace the `<form>…</form>` block in [contact.html](contact.html)
   with that iframe (you'll lose the on-page styling but gain the
   Google Sheet integration).
5. Run `./bump-version.sh`, commit and push.

### Trade-offs

- Submissions are visible in a Sheet (great for data work).
- Visitors see a Google-branded form (less custom-feeling).
- No email notification by default - you can add one via Google
  Apps Script if needed.

---

## Other options worth knowing about

| Service | Best for | Notes |
|---|---|---|
| **EmailJS** ([emailjs.com](https://www.emailjs.com)) | Sending email purely from JavaScript (no relay) | Free tier: 200 emails/month |
| **Netlify Forms** | If you migrate hosting to Netlify | Built-in, no third-party signup |
| **Cloudflare Workers + email** | Self-hosted relay | Requires writing a small Worker |
| **`mailto:` link** | Absolute simplest | Opens visitor's email client; loses analytics |

---

## Anti-spam tips (already applied)

- The **honeypot field** (`name="botcheck"`) is hidden from humans
  but visible to dumb bots. Bots that tick it get a fake "thank you"
  with no actual submission.
- Add a CAPTCHA if spam slips through - Web3Forms supports
  hCaptcha out of the box (one extra hidden field).
- Set up an inbox filter on `info@brahmkshatriya.org` for emails
  from `noreply@web3forms.com` so submissions go to a dedicated
  folder.

---

## Testing your setup

1. Open `https://brahmakshatriyahitechchhu.org/contact.html` in a
   private/incognito window.
2. Fill the form with your own details and a test message.
3. Click Send. You should see "✓ Thank you! Your message has been
   received."
4. Check your inbox - the test message should arrive within a minute.

If you see the "⚠️  Form not yet configured" warning instead, the
access key in `contact.html` still has the placeholder value. Edit
it as described in step 4 of the Web3Forms setup above.

If you see "✗ Sorry, something went wrong", check the browser
DevTools console (right-click → Inspect → Console). Common causes:
- Access key invalid (re-create at web3forms.com)
- Inbox marked the verification email as spam (check spam folder)
