import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '@/lib/db';
import { User, UserRole } from '@/types/user';
import { sendVerificationCode } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role, phone, location } = body;

    // Validate required fields
    if (!email || !password || !name || !role || !phone || !location) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate name (minimum 3 characters)
    if (name.trim().length < 3) {
      return NextResponse.json(
        { error: 'Full name must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate phone number
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const startsWithCountryCode = cleanPhone.startsWith('+254');
    const startsWithZero = cleanPhone.startsWith('07');
    
    if (!startsWithCountryCode && !startsWithZero) {
      return NextResponse.json(
        { error: 'Phone number must start with +254 or 07' },
        { status: 400 }
      );
    }
    
    const numbersOnly = cleanPhone.replace('+', '');
    if (!/^\d+$/.test(numbersOnly)) {
      return NextResponse.json(
        { error: 'Phone number must contain only numbers' },
        { status: 400 }
      );
    }
    
    if (numbersOnly.length < 10 || numbersOnly.length > 13) {
      return NextResponse.json(
        { error: 'Phone number must be 10-13 digits' },
        { status: 400 }
      );
    }

    // Validate location (Kenya counties)
    const KENYA_COUNTIES = [
      'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
      'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
      'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
      'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
      'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
      'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
      'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
    ];
    
    if (!KENYA_COUNTIES.includes(location)) {
      return NextResponse.json(
        { error: 'Invalid county selected' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: UserRole[] = ['farmer', 'student', 'learner', 'buyer', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Check if user already exists
    const existingUser = db.data.users.find(
      (u: User) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 5-digit verification code
    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
    const codeGeneratedAt = new Date();

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
      phone: phone || undefined,
      location: location || undefined,
      skills: [],
      isVerified: false,
      verificationCode,
      codeGeneratedAt,
      resendAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add role-specific fields
    if (role === 'student' || role === 'learner') {
      newUser.enrolledCourses = [];
      newUser.completedCourses = [];
      newUser.certificates = [];
    }

    // Add user to database
    db.data.users.push(newUser);
    await saveDb(db);

    // Send verification code email
    try {
      await sendVerificationCode({
        to: email,
        name,
        code: verificationCode,
      });
    } catch (emailError) {
      console.error('Failed to send verification code:', emailError);
      // Continue with registration even if email fails
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: 'User registered successfully. Please check your email to verify your account.',
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
