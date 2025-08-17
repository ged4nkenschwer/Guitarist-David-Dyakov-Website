# Contact Form Setup Guide

This guide explains how to make the contact form on your classical guitarist website fully functional.

## Current Implementation

The contact form is already implemented with:
- ✅ **HTML Form Structure**: Complete contact form with validation
- ✅ **JavaScript Validation**: Client-side form validation with error handling
- ✅ **Formspree Integration**: Ready to use with Formspree service
- ✅ **Real Contact Information**: Professional email and contact details
- ✅ **Responsive Design**: Works on all devices

## Option 1: Using Formspree (Recommended - Easy Setup)

### Steps:
1. **Create Formspree Account**: 
   - Go to [formspree.io](https://formspree.io)
   - Sign up for a free account

2. **Create New Form**:
   - Create a new form in your Formspree dashboard
   - Copy your form endpoint URL (looks like `https://formspree.io/f/xpwzgdkn`)

3. **Update Form Action**:
   - Open `index.html`
   - Find line 692: `<form id="combinedForm" class="combined-form animate-on-scroll" method="POST" action="https://formspree.io/f/xpwzgdkn">`
   - Replace `xpwzgdkn` with your actual Formspree form ID

4. **Configure Formspree**:
   - Set up email notifications in your Formspree dashboard
   - Configure spam protection
   - Add custom thank you messages

### Benefits:
- ✅ No server setup required
- ✅ Spam protection included
- ✅ Email notifications
- ✅ Form submissions dashboard
- ✅ Free tier available

## Option 2: Self-Hosted PHP Backend

### Requirements:
- Web server with PHP support
- PHP mail() function enabled
- Domain with SSL certificate

### Steps:
1. **Upload Backend**:
   - Upload `contact-handler.php` to your web server
   - Update the email address in the PHP file (line 13)

2. **Update Form Action**:
   - Open `index.html`
   - Change form action to: `action="contact-handler.php"`

3. **Configure Email Settings**:
   - Ensure your server can send emails
   - Test with a simple PHP mail script first

## Option 3: Third-Party Services

### Netlify Forms:
If hosting on Netlify, simply add `netlify` attribute to the form:
```html
<form ... netlify>
```

### Other Services:
- **EmailJS**: JavaScript-only solution
- **ConvertKit**: With newsletter integration
- **Mailchimp**: For newsletter subscriptions

## Current Contact Information

The form includes:
- **Email**: `david.dyakov@capricciodiabolico.com`
- **Location**: Europe
- **Services**: Concerts, masterclasses & recordings

## Features Included

### 📧 **Contact Form**:
- Name (optional)
- Email (required)
- Location (optional) 
- Message (optional - but either name or message required)
- Newsletter subscription checkbox

### ✅ **Validation**:
- Email format validation
- Required field checking
- Real-time error messages
- Loading state during submission

### 🎨 **Styling**:
- Professional design matching website theme
- Error state styling (red borders/backgrounds)
- Success message with elegant styling
- Hover effects and smooth transitions

### 📱 **Responsive**:
- Works perfectly on desktop, tablet, and mobile
- Touch-friendly form elements
- Adaptive layout

## Testing the Form

1. **Fill out the form** with test data
2. **Submit and check** for confirmation message
3. **Verify email delivery** to your inbox
4. **Test validation** by submitting invalid data

## Troubleshooting

### Form not submitting:
- Check browser console for JavaScript errors
- Verify form action URL is correct
- Ensure internet connection is stable

### Emails not received:
- Check spam/junk folder
- Verify email address in configuration
- Test with different email providers

### Validation not working:
- Ensure JavaScript is enabled
- Check for browser compatibility issues
- Verify form field IDs match JavaScript selectors

## Advanced Features

### Newsletter Integration:
The form includes a newsletter subscription option. You can integrate with:
- Mailchimp API
- ConvertKit API
- Custom newsletter system

### Analytics Tracking:
Add form submission tracking with:
- Google Analytics events
- Facebook Pixel events
- Custom analytics solutions

## Support

For additional help:
- Check browser developer tools for errors
- Test with different browsers and devices
- Contact your hosting provider for PHP/email issues

---

**Your contact form is now professional, functional, and ready to connect you with your audience!** 🎸✨
