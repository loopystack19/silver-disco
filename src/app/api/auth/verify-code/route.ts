import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { User } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // Validate required fields
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Validate code format (5 digits)
    if (!/^\d{5}$/.test(code)) {
      return NextResponse.json(
        { error: 'Verification code must be 5 digits' },
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
      // Determine dashboard path based on role
      const dashboardPath = getDashboardPath(user.role);
      return NextResponse.json(
        { 
          message: 'Email already verified',
          dashboardPath 
        },
        { status: 200 }
      );
    }

    // Check if verification code exists
    if (!user.verificationCode) {
      return NextResponse.json(
        { error: 'No verification code found. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check if code has expired (10 minutes)
    if (user.codeGeneratedAt) {
      const codeAge = Date.now() - new Date(user.codeGeneratedAt).getTime();
      const tenMinutesInMs = 10 * 60 * 1000;
      
      if (codeAge > tenMinutesInMs) {
        return NextResponse.json(
          { error: 'Verification code has expired. Please request a new code.' },
          { status: 400 }
        );
      }
    }

    // Verify the code
    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code. Please try again.' },
        { status: 400 }
      );
    }

    // Update user verification status
    db.data.users[userIndex] = {
      ...user,
      isVerified: true,
      verifiedAt: new Date(),
      verificationCode: undefined,
      codeGeneratedAt: undefined,
      resendAttempts: 0,
      lastResendAt: undefined,
      updatedAt: new Date(),
    };

    await saveDb(db);

    // Determine dashboard path based on role
    const dashboardPath = getDashboardPath(user.role);

    return NextResponse.json(
      { 
        message: 'Email verified successfully',
        dashboardPath
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Code verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to determine dashboard path based on role
function getDashboardPath(role: string): string {
  switch (role) {
    case 'farmer':
      return '/dashboard/farmers';
    case 'student':
      return '/dashboard/students';
    case 'learner':
      return '/dashboard/learners';
    case 'buyer':
      return '/dashboard/buyers';
    case 'admin':
      return '/dashboard/admin';
    default:
      return '/login';
  }
}
