import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '@/lib/db';
import { User } from '@/types/user';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

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
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account exists with this email, a verification link has been sent.' },
        { status: 200 }
      );
    }

    const user = db.data.users[userIndex];

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        { error: 'This email is already verified' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = uuidv4();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setMinutes(verificationTokenExpiry.getMinutes() + 30); // 30 minutes expiry

    // Update user with new token
    db.data.users[userIndex] = {
      ...user,
      verificationToken,
      verificationTokenExpiry,
      updatedAt: new Date(),
    };

    await saveDb(db);

    // Send verification email
    try {
      await sendVerificationEmail({
        to: email,
        name: user.name,
        token: verificationToken,
      });

      return NextResponse.json(
        { message: 'Verification email sent successfully' },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
