# Email Verification Code System Guide

## Overview

UmojaHub now uses a **numeric verification code system** instead of clickable email links. Users receive a 5-digit code via email that they must enter on the verification page to activate their account.

## Features

### 1. Registration Flow

When a user registers with any role (Farmer, Student, Learner, Buyer, Admin):

1. A random **5-digit verification code** is generated (e.g., `34827`)
2. The code is stored in the user's record with a timestamp
3. User receives an email with the verification code
4. User is redirected to `/verify` page with their email pre-filled
5. User enters the code to verify their account

### 2. Verification Page (`/verify`)

**Location:** `/verify`

**Features:**
- Email input field (pre-filled if coming from registration)
- 5-digit code input field (numeric only, auto-formatted)
- Real-time validation
- Success/error messages
- Resend code button
- Link to login page

**Usage:**
- Users can manually navigate to `/verify` if they lost the email
- Email field allows users to specify their account
- Code field only accepts 5 numeric digits

### 3. Code Expiration

**Duration:** 10 minutes

The verification code expires 10 minutes after generation. This is tracked using the `codeGeneratedAt` timestamp.

If a user tries to verify with an expired code:
- Error message: "Verification code has expired. Please request a new code."
- User must click "Resend Code" to get a new one

### 4. Resend Code Functionality

**Rate Limiting:** 3 attempts per 30 minutes

**Features:**
- Users can request a new code if they didn't receive the original
- Each resend generates a new random 5-digit code
- Old code is invalidated when new code is generated
- Counter tracks resend attempts
- After 3 attempts, users must wait 30 minutes

**Error Messages:**
- "Maximum resend attempts reached. Please try again in 30 minutes."

### 5. Security Features

#### Code Expiration
- All codes expire after 10 minutes
- Expired codes cannot be used for verification

#### Rate Limiting
- Maximum 3 resend attempts within 30 minutes
- Counter resets automatically after 30 minutes
- Prevents spam and abuse

#### Local Storage
- All data stored in LowDB (db.json)
- No external database dependencies

## API Endpoints

### 1. Registration
**Endpoint:** `POST /api/auth/register`

**Changes:**
- Generates 5-digit verification code instead of UUID token
- Stores `verificationCode` and `codeGeneratedAt`
- Initializes `resendAttempts` to 0
- Sends verification code email

### 2. Verify Code
**Endpoint:** `POST /api/auth/verify-code`

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "12345"
}
```

**Success Response:**
```json
{
  "message": "Email verified successfully",
  "dashboardPath": "/dashboard/farmers"
}
```

**Error Responses:**
- Invalid code: `400` - "Invalid verification code. Please try again."
- Expired code: `400` - "Verification code has expired. Please request a new code."
- No code found: `400` - "No verification code found. Please request a new code."
- User not found: `404` - "User not found"

### 3. Resend Code
**Endpoint:** `POST /api/auth/resend-code`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response:**
```json
{
  "message": "Verification code sent successfully",
  "attemptsRemaining": 2
}
```

**Error Responses:**
- Already verified: `400` - "Email is already verified"
- Rate limit exceeded: `429` - "Maximum resend attempts reached. Please try again in 30 minutes."
- User not found: `404` - "User not found"

## Database Schema Updates

### User Schema Changes

```typescript
interface User {
  // ... other fields
  
  // Email verification with numeric code
  isVerified: boolean;
  verificationCode?: string;        // NEW: 5-digit numeric code
  codeGeneratedAt?: Date;           // NEW: For 10-minute expiration
  verifiedAt?: Date;
  
  // Rate limiting for resend
  resendAttempts?: number;          // NEW: Count of resend attempts
  lastResendAt?: Date;              // NEW: Timestamp of last resend
}
```

## Email Template

**Subject:** UmojaHub Email Verification

**Body:**
```
Hello [User Name],

Welcome to UmojaHub!

Your verification code is:

┌─────────────────────────┐
│        12345            │
└─────────────────────────┘

Enter this code on the verification page to activate your account.

This code will expire in 10 minutes.
```

## User Flow

### Happy Path

1. User registers at `/register`
2. System generates 5-digit code
3. User receives email with code
4. User is redirected to `/verify?email=user@example.com`
5. User enters the 5-digit code
6. System validates code
7. User is redirected to their dashboard based on role:
   - Farmer → `/dashboard/farmers`
   - Student → `/dashboard/students`
   - Learner → `/dashboard/learners`
   - Buyer → `/dashboard/buyers`
   - Admin → `/dashboard/admin`

### Code Expired

1. User tries to verify with expired code
2. System shows error: "Verification code has expired"
3. User clicks "Resend Code"
4. New code is generated and sent
5. User enters new code
6. Verification successful

### Rate Limit Reached

1. User requests resend 3 times within 30 minutes
2. System shows error: "Maximum resend attempts reached"
3. User must wait 30 minutes
4. After 30 minutes, counter resets
5. User can request new code

## Testing the System

### 1. Register a New User

```bash
# Using curl or Postman
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "farmer"
}
```

### 2. Check Email

Look for the verification code in the email sent to the user.

### 3. Verify with Code

Navigate to: `http://localhost:3000/verify?email=test@example.com`

Enter the 5-digit code received in the email.

### 4. Test Expiration

Wait 10 minutes and try to use the same code. You should see an expiration error.

### 5. Test Resend

Click "Resend Code" multiple times to test rate limiting.

## Migration from Old System

If you have existing users with the old token-based verification:

1. Old verification tokens are no longer used
2. Users with `verificationToken` can still use the old `/api/auth/verify-email` endpoint
3. New registrations automatically use the code-based system
4. Consider sending new codes to unverified users

## Environment Variables

Ensure these are set in your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXTAUTH_URL=http://localhost:3000
```

## Troubleshooting

### Code Not Received

**Solutions:**
1. Check spam/junk folder
2. Verify SMTP configuration in `.env`
3. Check server logs for email sending errors
4. Use "Resend Code" button

### Code Not Working

**Possible Issues:**
1. Code expired (10 minutes passed)
2. Wrong code entered
3. Email address mismatch
4. Code already used

**Solutions:**
1. Request new code using "Resend Code"
2. Double-check the code from email
3. Verify email address is correct
4. Check if account is already verified

### Rate Limit Issues

**Problem:** User reached 3 resend attempts

**Solution:** Wait 30 minutes for counter to reset

### Database Issues

**Problem:** Code not being saved/retrieved

**Solution:**
1. Check `db.json` file exists
2. Verify write permissions
3. Check database initialization in `src/lib/db.ts`

## Security Considerations

1. **Code Randomness:** 5-digit codes provide 100,000 possible combinations
2. **Time Limit:** 10-minute expiration reduces attack window
3. **Rate Limiting:** 3 attempts per 30 minutes prevents brute force
4. **Local Storage:** LowDB provides secure local storage without external dependencies
5. **Email Validation:** Email must match registered user

## Future Enhancements

Potential improvements for the verification system:

1. SMS verification as alternative to email
2. Longer codes (6-7 digits) for increased security
3. IP-based rate limiting
4. Account lockout after multiple failed attempts
5. Email verification reminders
6. Multi-factor authentication
7. Biometric verification for mobile apps

## Support

For issues or questions:
1. Check this documentation
2. Review server logs
3. Verify SMTP configuration
4. Test with different email providers
5. Check database integrity

## Conclusion

The numeric verification code system provides a secure, user-friendly way to verify email addresses. With 10-minute expiration and rate limiting, it balances security with usability while maintaining simplicity through local LowDB storage.
