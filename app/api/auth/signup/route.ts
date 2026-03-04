import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { emailService } from '@/lib/email/service';
import { trackFreeSignup } from '@/lib/conversion-analytics';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, plan = 'free' } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
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

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        subscriptionPlan: plan,
        subscriptionStatus: plan === 'free' ? 'active' : 'inactive',
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Schedule onboarding emails (async, don't wait for completion)
    try {
      await emailService.scheduleOnboardingSequence(
        user.id,
        user.email,
        user.name || user.email,
        plan
      );
      console.log(`📧 Scheduled onboarding emails for ${user.email}`);
    } catch (emailError) {
      console.error('Failed to schedule onboarding emails:', emailError);
      // Don't fail the signup if email scheduling fails
    }

    // Track conversion analytics
    try {
      if (plan === 'free') {
        trackFreeSignup(user.id, user.email);
      }
    } catch (analyticsError) {
      console.error('Failed to track conversion analytics:', analyticsError);
      // Don't fail the signup if analytics tracking fails
    }

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}