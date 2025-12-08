# VitaInspire - Form Submission Email Setup

## Overview

The "Submit Your Idea" form on the VitaInspire website now sends emails to **ramana@vitainspire.com** using [FormSubmit.co](https://formsubmit.co), a free form submission service.

## How It Works

1. When a user fills out and submits the form, the data is sent to FormSubmit.co
2. FormSubmit.co processes the form and sends an email to ramana@vitainspire.com
3. The user is redirected back to the website with a success message

## First-Time Setup Required ⚠️

**IMPORTANT**: On the **first form submission only**, FormSubmit.co will send a confirmation email to **ramana@vitainspire.com**. 

### Setup Steps:

1. Submit a test form on your website
2. Check the inbox for **ramana@vitainspire.com**
3. Look for an email from FormSubmit with subject like "Activate Form"
4. **Click the activation link** in that email
5. After activation, all future form submissions will be delivered automatically

## Email Format

Each submission will be sent as a table-formatted email containing:

- **Name**: The submitter's name
- **Email Address**: The submitter's email
- **Organization**: Their organization (if provided)
- **Social Impact Sector**: The sector they selected
- **Problem**: The problem they're addressing
- **Solution**: Their AI product idea
- **Impact**: Expected impact
- **Data Availability**: Information about available data

## Security Features

The form includes:

- **Honeypot field** (`_honey`) to prevent spam bots
- **CAPTCHA disabled** for better user experience (can be enabled if spam becomes an issue)
- **Email validation** (HTML5 built-in)
- **Required fields** for critical information

## For Production Deployment

When deploying to production (e.g., Vercel), you need to:

1. Update the `_next` redirect URL in the form to point to your production domain
   - Currently set to: `http://localhost:8080/#submit-idea?success=true`
   - Change to: `https://yourdomain.com/#submit-idea?success=true`
   
   **OR** (Better option): The JavaScript automatically updates the redirect URL based on the current domain, so you don't need to manually change it!

2. Complete the email activation process on production as well (FormSubmit tracks by email + domain combination)

## Testing the Form

1. Navigate to the "Submit an Idea" section
2. Fill out all required fields
3. Click "Submit Your Idea"
4. You should see a "Sending..." message
5. After submission, you'll be redirected back with a success message
6. Check ramana@vitainspire.com for the email

## Alternative Email Service Options

If you want to use a different email service provider in the future:

### Option 1: FormSpree (Similar to FormSubmit)
- Website: https://formspree.io
- Free tier: 50 submissions/month
- Requires account creation

### Option 2: EmailJS (Client-side)
- Website: https://www.emailjs.com
- Free tier: 200 emails/month
- Requires JavaScript library

### Option 3: Custom Backend
- Set up your own backend API
- Use services like SendGrid, Mailgun, or AWS SES
- More control but requires server setup

## Troubleshooting

### Form not sending emails?
1. Check if you activated the FormSubmit email (see First-Time Setup above)
2. Check spam folder in ramana@vitainspire.com
3. Verify the form action URL is correct: `https://formsubmit.co/ramana@vitainspire.com`

### Users not seeing success message?
1. Check browser console for JavaScript errors
2. Ensure the redirect URL is correct
3. Test in different browsers

### Getting spam submissions?
1. Enable CAPTCHA by changing `_captcha` from "false" to "true" in the form
2. Add more sophisticated spam protection
3. Consider using a different form service with better spam filters

## Current Configuration

```html
<form action="https://formsubmit.co/ramana@vitainspire.com" method="POST">
    <input type="hidden" name="_subject" value="New AI Product Idea Submission - VitaInspire">
    <input type="hidden" name="_captcha" value="false">
    <input type="hidden" name="_template" value="table">
    <input type="hidden" name="_next" value="[auto-updated by JavaScript]">
    ... form fields ...
</form>
```

## Support

For issues with FormSubmit.co:
- Documentation: https://formsubmit.co/documentation
- Contact: support@formsubmit.co

For issues with the website form itself:
- Check the JavaScript console for errors
- Review `/js/main.js` for the form handling code
- Verify all form field names match the expected values
