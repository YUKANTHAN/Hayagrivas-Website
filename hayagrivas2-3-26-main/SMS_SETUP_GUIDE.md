# SMS Integration Setup Guide for HAYAGRIVAS Contact Form

## Overview
This guide explains how to set up SMS notifications for customers who submit the contact form.

## What's Already Done ✅
1. ✅ Phone number field added to contact form
2. ✅ Fee structure configuration file created (`fee-structure.json`)
3. ✅ Email notifications with fee details implemented
4. ✅ Server code prepared for SMS integration

## SMS Service Options for India

### Option 1: Twilio (Recommended - International)
**Pros:** Reliable, easy to use, good documentation
**Cons:** Slightly expensive for India

**Setup Steps:**
1. Sign up at https://www.twilio.com/
2. Get your Account SID and Auth Token
3. Get a Twilio phone number
4. Install package: `npm install twilio`
5. Uncomment the Twilio code in `server.js` (lines 97-107)
6. Replace credentials:
   - `YOUR_TWILIO_ACCOUNT_SID`
   - `YOUR_TWILIO_AUTH_TOKEN`
   - `YOUR_TWILIO_PHONE_NUMBER`

### Option 2: MSG91 (Popular in India)
**Pros:** India-focused, affordable, supports regional languages
**Cons:** Requires DLT registration

**Setup Steps:**
1. Sign up at https://msg91.com/
2. Get your Auth Key
3. Register your DLT template
4. Install package: `npm install msg91-sms`
5. Add this code to server.js:

```javascript
const MSG91 = require('msg91-sms');

const msg91 = new MSG91('YOUR_AUTH_KEY', 'YOUR_SENDER_ID', 'YOUR_ROUTE');

const smsMessage = `Dear ${name},

Thank you for choosing HAYAGRIVAS INTERNATIONAL SCHOOL!

${programDetails.name}
Annual Fee: ${programDetails.annualFee}
Admission Fee: ${programDetails.admissionFee}

${programDetails.details}

Contact: 73737 44882
Email: admin@hayagrivascbse.com

We will contact you soon!

- HAYAGRIVAS Team`;

await msg91.send(phone, smsMessage);
```

### Option 3: Fast2SMS (Budget-friendly for India)
**Pros:** Very affordable, easy setup
**Cons:** Limited features

**Setup Steps:**
1. Sign up at https://www.fast2sms.com/
2. Get your API Key
3. Install package: `npm install fast-two-sms`
4. Add this code to server.js:

```javascript
const fast2sms = require('fast-two-sms');

const smsOptions = {
    authorization: 'YOUR_API_KEY',
    message: `Dear ${name}, Thank you for choosing HAYAGRIVAS! ${programDetails.name} - Annual Fee: ${programDetails.annualFee}, Admission: ${programDetails.admissionFee}. Contact: 73737 44882`,
    numbers: [phone]
};

await fast2sms.sendMessage(smsOptions);
```

### Option 4: TextLocal (India)
**Pros:** Good for bulk SMS, reliable
**Cons:** Requires API key and sender ID

**Setup Steps:**
1. Sign up at https://www.textlocal.in/
2. Get your API Key
3. Install package: `npm install textlocal`
4. Add this code to server.js:

```javascript
const Textlocal = require('textlocal');

const textlocal = new Textlocal('YOUR_API_KEY', { sender: 'HAYGRV' });

const smsMessage = `Dear ${name}, Thank you for choosing HAYAGRIVAS! ${programDetails.name} - Fee: ${programDetails.annualFee}. Contact: 73737 44882`;

await textlocal.sendSms(phone, smsMessage);
```

## Fee Structure Configuration

The fee details are stored in `fee-structure.json`. You can edit this file to update:
- Annual fees
- Admission fees
- Program details
- Contact information

**Current Structure:**
```json
{
  "programs": {
    "early": {
      "name": "Early Years (KG.I - KG.II)",
      "annualFee": "₹45,000",
      "admissionFee": "₹5,000",
      "details": "Includes books, uniforms, and activity materials"
    },
    "primary": { ... },
    "secondary": { ... }
  }
}
```

## Testing

1. **Test Email First:**
   - Make sure email credentials are set in `server.js`
   - Submit the contact form
   - Check if email is received with fee details

2. **Test SMS:**
   - Choose an SMS provider from above
   - Set up credentials
   - Test with your own phone number first
   - Verify the message format and content

## Important Notes

⚠️ **DLT Registration (India):**
For commercial SMS in India, you need to register with DLT (Distributed Ledger Technology):
- Register your business
- Register your SMS template
- Get approval before sending bulk SMS

⚠️ **Cost Considerations:**
- Twilio: ~₹0.50-1.00 per SMS
- MSG91: ~₹0.15-0.30 per SMS
- Fast2SMS: ~₹0.10-0.20 per SMS
- TextLocal: ~₹0.15-0.25 per SMS

⚠️ **Phone Number Format:**
Ensure phone numbers are in international format:
- India: +91XXXXXXXXXX
- The form currently accepts any format, but SMS services require +91 prefix

## Recommended Setup for HAYAGRIVAS

**For Production:**
1. Use **MSG91** or **TextLocal** (India-focused, affordable)
2. Complete DLT registration
3. Set up proper error handling
4. Add SMS delivery status tracking
5. Keep SMS messages under 160 characters for single SMS cost

**For Testing:**
1. Use **Twilio** trial account (free credits)
2. Test with verified numbers
3. Switch to MSG91/TextLocal for production

## Support

If you need help setting up:
1. Choose your preferred SMS provider
2. Follow their documentation
3. Update the server.js with your credentials
4. Test thoroughly before going live

---
**Last Updated:** February 2026
**Contact:** admin@hayagrivascbse.com
