import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { User } from '@/types/user';
import { sendVerificationCode } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Find user by email
    const userIndex = db.data.users.findIndex(
      (u: User) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = db.data.users[userIndex];

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Rate limiting: Check resend attempts (max 3 within 30 minutes)
    const now = new Date();
    const thirtyMinutesInMs = 30 * 60 * 1000;
    
    // Reset counter if 30 minutes have passed since last resend
    if (user.lastResendAt) {
      const timeSinceLastResend = now.getTime() - new Date(user.lastResendAt).getTime();
      
      if (timeSinceLastResend > thirtyMinutesInMs) {
        // Reset the counter
        user.resendAttempts = 0;
      }
    }

    // Check if user has exceeded resend limit
    const currentAttempts = user.resendAttempts || 0;
    if (currentAttempts >= 3) {
      return NextResponse.json(
        { error: 'Maximum resend attempts reached. Please try again in 30 minutes.' },
        { status: 429 }
      );
    }

    // Generate new verification code
    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
    const codeGeneratedAt = new Date();

    // Update user with new code and increment resend attempts
    db.data.users[userIndex] = {
      ...user,
      verificationCode,
      codeGeneratedAt,
      resendAttempts: currentAttempts + 1,
      lastResendAt: now,
      updatedAt: now,
    };

    await saveDb(db);

    // Send verification code email
    try {
      await sendVerificationCode({
        to: email,
        name: user.name,
        code: verificationCode,
      });
    } catch (emailError) {
      console.error('Failed to send verification code:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification code. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Verification code sent successfully',
        attemptsRemaining: 3 - (currentAttempts + 1)
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resend code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
