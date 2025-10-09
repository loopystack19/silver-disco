import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { User } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Find user with this verification token
    const userIndex = db.data.users.findIndex(
      (u: User) => u.verificationToken === token
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 404 }
      );
    }

    const user = db.data.users[userIndex];

    // Check if token has expired
    if (user.verificationTokenExpiry && new Date() > new Date(user.verificationTokenExpiry)) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        { message: 'Email already verified' },
        { status: 200 }
      );
    }

    // Update user verification status
    db.data.users[userIndex] = {
      ...user,
      isVerified: true,
      verifiedAt: new Date(),
      verificationToken: undefined,
      verificationTokenExpiry: undefined,
      updatedAt: new Date(),
    };

    await saveDb(db);

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/verify-failed?reason=missing-token', request.url));
    }

    const db = await getDb();

    // Find user with this verification token
    const userIndex = db.data.users.findIndex(
      (u: User) => u.verificationToken === token
    );

    if (userIndex === -1) {
      return NextResponse.redirect(new URL('/verify-failed?reason=invalid-token', request.url));
    }

    const user = db.data.users[userIndex];

    // Check if token has expired
    if (user.verificationTokenExpiry && new Date() > new Date(user.verificationTokenExpiry)) {
      return NextResponse.redirect(new URL('/verify-failed?reason=expired', request.url));
    }

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.redirect(new URL('/verified-success?already=true', request.url));
    }

    // Update user verification status
    db.data.users[userIndex] = {
      ...user,
      isVerified: true,
      verifiedAt: new Date(),
      verificationToken: undefined,
      verificationTokenExpiry: undefined,
      updatedAt: new Date(),
    };

    await saveDb(db);

    return NextResponse.redirect(new URL('/verified-success', request.url));
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(new URL('/verify-failed?reason=error', request.url));
  }
}
