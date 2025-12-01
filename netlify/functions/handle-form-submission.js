/**
 * Netlify Serverless Function
 * Handles form submissions and sends email notifications
 * 
 * This function is triggered automatically by Netlify Forms
 * when a form submission occurs.
 * 
 * To enable this function:
 * 1. Go to Netlify Dashboard > Forms > Your form > Settings
 * 2. Under "Form notifications", add a webhook
 * 3. Set the webhook URL to: https://your-site.netlify.app/.netlify/functions/handle-form-submission
 * 
 * OR configure it in netlify.toml (see below)
 */

// Use native fetch (available in Node.js 18+ on Netlify)
// If you need to support older versions, uncomment the node-fetch require
// const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form data from Netlify
    // Netlify Forms webhooks send data as form-encoded or JSON
    let formData;
    
    if (event.headers['content-type']?.includes('application/json')) {
      formData = JSON.parse(event.body);
    } else {
      // Handle form-encoded data
      const params = new URLSearchParams(event.body);
      formData = {};
      for (const [key, value] of params.entries()) {
        formData[key] = value;
      }
    }
    
    // Extract form fields
    const {
      name = 'Not provided',
      email,
      location = 'Not provided',
      message = 'No message provided',
      subscribe = false,
      form_type = 'contact',
      source = 'website'
    } = formData;

    // Validate required fields
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Prepare email content
    const emailSubject = `New Contact Form Submission from ${name || 'Anonymous'}`;
    const emailBody = `
New contact form submission received:

Name: ${name}
Email: ${email}
Location: ${location}
Message: ${message}
Newsletter Subscription: ${subscribe ? 'Yes' : 'No'}
Form Type: ${form_type}
Source: ${source}

---
This email was sent automatically from your website contact form.
Submitted at: ${new Date().toLocaleString()}
    `.trim();

    // Option 1: Send email using Netlify's built-in email service
    // You can configure this in Netlify dashboard under Forms > Notifications
    
    // Option 2: Send email using external service (e.g., SendGrid, Mailgun, etc.)
    // Uncomment and configure one of the following:

    // Example: Using SendGrid (requires SENDGRID_API_KEY environment variable)
    /*
    if (process.env.SENDGRID_API_KEY) {
      const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: process.env.NOTIFICATION_EMAIL || 'your-email@example.com' }]
          }],
          from: { email: 'noreply@daviddyakov.com', name: 'David Dyakov Website' },
          subject: emailSubject,
          content: [{
            type: 'text/plain',
            value: emailBody
          }]
        })
      });

      if (!sendGridResponse.ok) {
        throw new Error('Failed to send email via SendGrid');
      }
    }
    */

    // Example: Using Mailgun (requires MAILGUN_API_KEY and MAILGUN_DOMAIN)
    /*
    if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
      const mailgunResponse = await fetch(
        `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            from: `Website Contact Form <noreply@${process.env.MAILGUN_DOMAIN}>`,
            to: process.env.NOTIFICATION_EMAIL || 'your-email@example.com',
            subject: emailSubject,
            text: emailBody
          })
        }
      );

      if (!mailgunResponse.ok) {
        throw new Error('Failed to send email via Mailgun');
      }
    }
    */

    // Option 3: Send auto-reply to the user
    // This sends a confirmation email to the person who submitted the form
    /*
    if (process.env.SENDGRID_API_KEY) {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: email }]
          }],
          from: { email: 'contact@daviddyakov.com', name: 'David Dyakov' },
          subject: 'Thank you for contacting David Dyakov',
          content: [{
            type: 'text/html',
            value: `
              <html>
                <body>
                  <h2>Thank you for your message!</h2>
                  <p>Dear ${name || 'Valued Visitor'},</p>
                  <p>Thank you for reaching out. I have received your message and will respond as soon as possible.</p>
                  ${subscribe ? '<p>You have been subscribed to receive updates about upcoming concerts and news.</p>' : ''}
                  <p>Best regards,<br>David Dyakov</p>
                </body>
              </html>
            `
          }]
        })
      });
    }
    */

    // Log the submission (optional - for debugging)
    console.log('Form submission received:', {
      name,
      email,
      location,
      message: message.substring(0, 100) + '...',
      subscribe,
      timestamp: new Date().toISOString()
    });

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Form submission processed successfully',
        received: true
      })
    };

  } catch (error) {
    console.error('Error processing form submission:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process form submission',
        message: error.message
      })
    };
  }
};

