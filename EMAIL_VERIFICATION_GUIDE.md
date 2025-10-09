# Email Verification System Guide

## Overview

This guide documents the automatic email verification system implemented for UmojaHub. Users must verify their email addresses before they can log in to the platform.

## Features Implemented

### 1. **Automatic Email Sending on Registration**
- When a user registers, a verification email is automatically sent to their email address
- The email contains a unique verification link
- The verification token expires after 30 minutes

### 2. **Email Template**
- Professional HTML email template with UmojaHub branding
- Clear call-to-action button: "Verify My Account"
- Fallback link for users who can't click the button
- Friendly, welcoming message

### 3. **Verification Endpoint**
- GET request to `/api/auth/verify-email?token=<token>`
- Validates the token and checks expiry
- Updates user's `isVerified` status to `true`
- Redirects to appropriate success/failure page

### 4. **UI Pages**

#### Success Page (`/verified-success`)
- Displays confirmation message
- Shows "Go to Login" button
- Shows "Go to Home" button
- Handles already-verified users gracefully

#### Failure Page (`/verify-failed`)
- Shows appropriate error message based on failure reason:
  - Expired token
  - Invalid token
  - Missing token
  - Server error
- Includes resend verification option for expired tokens
- Links to create new account or go to login

### 5. **Login Integration**
- NextAuth checks verification status during login
- Unverified users cannot log in
- Login page shows verification banner for unverified users
- Includes "Resend Verification Email" button on login page

### 6. **Resend Verification**
- API endpoint: `/api/auth/resend-verification`
- Generates new token with 30-minute expiry
- Sends fresh verification email
- Available on both login page and verify-failed page

## Technical Details

### Database Schema
The User model includes these fields for verification:
```typescript
{
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  verifiedAt?: Date;
}
```

### Token System
- Tokens are generated using `uuid` (v4)
- Each token is unique and single-use
- Tokens expire after 30 minutes
- Expired tokens are automatically rejected

### Email Configuration
Uses Gmail SMTP with credentials from `.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=hubumoja@gmail.com
SMTP_PASS=<app-specific-password>
```

## API Endpoints

### 1. POST `/api/auth/register`
Registers a new user and sends verification email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "farmer"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": { ... }
}
```

### 2. GET `/api/auth/verify-email?token=<token>`
Verifies user's email address.

**Success:** Redirects to `/verified-success`
**Failure:** Redirects to `/verify-failed?reason=<reason>`

### 3. POST `/api/auth/resend-verification`
Resends verification email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Verification email sent successfully"
}
```

## Testing Instructions

### Local Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Register a new account:**
   - Navigate to http://localhost:3001/register
   - Fill in the registration form with valid details
   - Use a real email address you have access to
   - Submit the form

3. **Check your email:**
   - Open your email inbox
   - Look for email from "UmojaHub" (noreply@umojahub.com)
   - Subject: "Verify your UmojaHub account"

4. **Click verification link:**
   - Click the "Verify My Account" button in the email
   - OR copy and paste the verification link into your browser
   - You should be redirected to `/verified-success`

5. **Test login:**
   - Go to http://localhost:3001/login
   - Enter your credentials
   - You should be able to log in successfully

### Testing Edge Cases

#### 1. **Expired Token**
- Register a user
- Wait 30+ minutes
- Try to verify
- Should redirect to `/verify-failed?reason=expired`
- Should show resend option

#### 2. **Invalid Token**
- Try accessing `/api/auth/verify-email?token=invalid-token`
- Should redirect to `/verify-failed?reason=invalid-token`

#### 3. **Already Verified**
- Verify an account
- Try to use the same verification link again
- Should redirect to `/verified-success?already=true`

#### 4. **Login Without Verification**
- Register a user
- Don't verify email
- Try to log in
- Should show verification banner
- Should have resend option

#### 5. **Resend Verification**
- Register a user
- Go to login page
- Try to log in (will fail)
- Click "Resend Verification Email"
- Check inbox for new email

## Security Considerations

1. **Token Uniqueness:** Each token is a UUID v4, ensuring uniqueness
2. **Single Use:** Tokens are deleted after successful verification
3. **Time-Limited:** Tokens expire after 30 minutes
4. **No User Enumeration:** Resend endpoint doesn't reveal if email exists
5. **HTTPS Ready:** System works with HTTPS in production
6. **Password Hashing:** User passwords are hashed with bcrypt

## User Experience Flow

```
1. User Registers
   ↓
2. Verification Email Sent
   ↓
3. User Receives Email
   ↓
4. User Clicks Verification Link
   ↓
5. Token Validated & User Verified
   ↓
6. Redirected to Success Page
   ↓
7. User Can Now Log In
```

## Troubleshooting

### Email Not Received
- Check spam/junk folder
- Verify SMTP credentials in `.env`
- Check console logs for email sending errors
- Use "Resend Verification Email" button

### Verification Link Not Working
- Check if token has expired (30 minutes)
- Verify URL is complete and not broken
- Check browser console for errors
- Use resend functionality

### Cannot Log In After Verification
- Verify `isVerified` is `true` in database
- Clear browser cache and cookies
- Check NextAuth session configuration
- Review console logs for errors

## Future Enhancements

1. **Custom Email Templates:** Role-specific welcome emails
2. **Email Preferences:** Allow users to customize email frequency
3. **SMS Verification:** Add phone number verification option
4. **2FA Integration:** Two-factor authentication support
5. **Email Change Verification:** Re-verify when user changes email
6. **Bulk Verification:** Admin tool to verify multiple users
7. **Verification Analytics:** Track verification rates and timing

## Files Modified/Created

### Created:
- `src/lib/email.ts` - Email service utility
- `src/app/verified-success/page.tsx` - Success page
- `src/app/verify-failed/page.tsx` - Failure page
- `src/app/api/auth/resend-verification/route.ts` - Resend endpoint
- `EMAIL_VERIFICATION_GUIDE.md` - This guide

### Modified:
- `src/app/api/auth/register/route.ts` - Added email sending
- `src/app/api/auth/verify-email/route.ts` - Added redirects
- `src/app/(auth)/login/page.tsx` - Added verification banner
- `src/app/api/auth/[...nextauth]/route.ts` - Added verification check
- `package.json` - Added nodemailer dependencies

## Support

For issues or questions about the email verification system:
- Check console logs for detailed error messages
- Review this guide's troubleshooting section
- Verify SMTP configuration in `.env`
- Test with a fresh user account

## Conclusion

The email verification system is now fully functional and integrated into UmojaHub. All new users must verify their email addresses before they can access the platform, ensuring better account security and reducing spam accounts.
