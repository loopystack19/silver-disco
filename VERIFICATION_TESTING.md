# Quick Testing Guide for Verification Code System

## Prerequisites

1. Ensure SMTP is configured in `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXTAUTH_URL=http://localhost:3000
```

2. Start the development server:
```bash
npm run dev
```

## Test Scenarios

### Scenario 1: Complete Registration and Verification Flow

**Steps:**
1. Navigate to `http://localhost:3000/register`
2. Fill in the registration form:
   - Name: Test User
   - Email: your-test-email@gmail.com
   - Password: password123
   - Confirm Password: password123
   - Role: Select "Farmer"
3. Click "Create Account"
4. You should be redirected to `/verify?email=your-test-email@gmail.com`
5. Check your email for the 5-digit verification code
6. Enter the code in the verification page
7. Click "Verify Account"
8. You should be redirected to `/dashboard/farmers`

**Expected Results:**
- ✅ Registration successful
- ✅ Email received with 5-digit code
- ✅ Code entry page loads with email pre-filled
- ✅ Verification successful
- ✅ Redirected to correct dashboard based on role

---

### Scenario 2: Code Expiration

**Steps:**
1. Register a new user (as in Scenario 1)
2. Note the verification code from the email
3. Wait 11 minutes (code expires after 10 minutes)
4. Try to verify with the expired code
5. Error should appear: "Verification code has expired"
6. Click "Resend Code"
7. Check email for new code
8. Enter new code
9. Verification should succeed

**Expected Results:**
- ✅ Expired code rejected
- ✅ New code generated and sent
- ✅ New code works for verification

---

### Scenario 3: Invalid Code

**Steps:**
1. Register a new user
2. Go to verification page
3. Enter an incorrect 5-digit code (e.g., 99999)
4. Click "Verify Account"

**Expected Results:**
- ✅ Error message: "Invalid verification code. Please try again."
- ✅ User can try again with correct code

---

### Scenario 4: Resend Rate Limiting

**Steps:**
1. Register a new user
2. On verification page, click "Resend Code" button
3. Wait for success message
4. Click "Resend Code" again
5. Wait for success message
6. Click "Resend Code" a third time
7. Wait for success message
8. Try to click "Resend Code" a fourth time

**Expected Results:**
- ✅ First 3 resends succeed
- ✅ Fourth attempt shows error: "Maximum resend attempts reached. Please try again in 30 minutes."
- ✅ Counter resets after 30 minutes

---

### Scenario 5: Different User Roles

**Test each role:**

**Farmer:**
- Register with role "Farmer"
- Verify code
- Should redirect to `/dashboard/farmers`

**Student (Job Seeker):**
- Register with role "Student"
- Verify code
- Should redirect to `/dashboard/students`

**Learner:**
- Register with role "Learner"
- Verify code
- Should redirect to `/dashboard/learners`

**Buyer:**
- Register with role "Buyer"
- Verify code
- Should redirect to `/dashboard/buyers`

**Admin:**
- Register with role "Admin"
- Verify code
- Should redirect to `/dashboard/admin`

---

### Scenario 6: Already Verified User

**Steps:**
1. Register and verify a user completely
2. Try to navigate to `/verify` with the same email
3. Enter any code and submit

**Expected Results:**
- ✅ Message: "Email already verified"
- ✅ Dashboard path returned

---

### Scenario 7: Manual Navigation to Verify Page

**Steps:**
1. Navigate directly to `http://localhost:3000/verify`
2. Manually enter email of an unverified user
3. Enter the verification code
4. Click "Verify Account"

**Expected Results:**
- ✅ Email field is empty initially
- ✅ User can manually enter email
- ✅ Verification works normally

---

## Database Verification

After registration, check `db.json`:

```json
{
  "users": [
    {
      "id": "...",
      "email": "test@example.com",
      "name": "Test User",
      "role": "farmer",
      "isVerified": false,
      "verificationCode": "12345",
      "codeGeneratedAt": "2025-01-10T08:00:00.000Z",
      "resendAttempts": 0,
      "createdAt": "2025-01-10T08:00:00.000Z"
    }
  ]
}
```

After verification, check that:
- `isVerified` changed to `true`
- `verificationCode` is cleared (undefined)
- `codeGeneratedAt` is cleared (undefined)
- `verifiedAt` timestamp is set

---

## Common Issues and Solutions

### Issue: Email not received

**Solutions:**
1. Check spam/junk folder
2. Verify SMTP credentials in `.env`
3. Check console logs for email sending errors
4. Try using "Resend Code" button

### Issue: Code not working

**Possible causes:**
1. Code expired (> 10 minutes old)
2. Wrong email entered
3. Wrong code entered
4. Account already verified

**Solution:** Request new code via "Resend Code"

### Issue: Can't resend code

**Cause:** Rate limit reached (3 attempts in 30 minutes)

**Solution:** Wait 30 minutes or check `db.json` to manually reset `resendAttempts` and `lastResendAt`

---

## Manual Database Testing

You can manually test by editing `db.json`:

### Reset Resend Counter:
```json
{
  "resendAttempts": 0,
  "lastResendAt": null
}
```

### Test Expired Code:
```json
{
  "codeGeneratedAt": "2020-01-01T00:00:00.000Z"
}
```

### Manually Verify User:
```json
{
  "isVerified": true,
  "verificationCode": null,
  "codeGeneratedAt": null,
  "verifiedAt": "2025-01-10T08:00:00.000Z"
}
```

---

## API Testing with cURL

### Register User:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "farmer"
  }'
```

### Verify Code:
```bash
curl -X POST http://localhost:3000/api/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "12345"
  }'
```

### Resend Code:
```bash
curl -X POST http://localhost:3000/api/auth/resend-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

---

## Success Criteria

✅ Users can register and receive verification code
✅ Code expires after 10 minutes
✅ Users can resend code (max 3 times in 30 minutes)
✅ Invalid codes are rejected
✅ Expired codes are rejected
✅ Users redirect to correct dashboard after verification
✅ Rate limiting works correctly
✅ All data stored locally in LowDB

---

## Next Steps After Testing

1. Configure production SMTP settings
2. Consider adding SMS verification
3. Set up monitoring for failed verifications
4. Implement reminder emails for unverified users
5. Add analytics for verification success rates
