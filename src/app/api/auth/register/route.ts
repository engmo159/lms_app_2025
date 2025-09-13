import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Teacher from '@/models/Teacher';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, school } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new teacher
    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      phone,
      school,
    });

    await newTeacher.save();

    // Return success (don't return password)
    const { password: _, ...teacherWithoutPassword } = newTeacher.toObject();

    return NextResponse.json(
      { message: 'تم إنشاء الحساب بنجاح', teacher: teacherWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    );
  }
}
