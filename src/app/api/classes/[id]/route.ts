import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Class from '@/models/Class';
import Student from '@/models/Student';
import Assignment from '@/models/Assignment';
import Attendance from '@/models/Attendance';
import Behavior from '@/models/Behavior';
import Grade from '@/models/Grade';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';
    const includeStudents = searchParams.get('includeStudents') === 'true';

    await dbConnect();
    
    let populateFields = 'teacher';
    if (includeStudents) {
      populateFields += ' students';
    }

    const classData = await Class.findOne({
      _id: id,
      teacher: session.user.id,
    }).populate(populateFields);

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    if (includeStats) {
      const studentCount = await Student.countDocuments({ 
        class: id, 
        isActive: true 
      });
      
      const assignmentCount = await Assignment.countDocuments({ 
        class: id 
      });
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const attendanceToday = await Attendance.countDocuments({
        class: id,
        date: { $gte: today },
        status: 'present'
      });

      const recentBehaviors = await Behavior.countDocuments({
        class: id,
        date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });

      const averageGrade = await Grade.aggregate([
        { $match: { class: classData._id } },
        { $group: { _id: null, avgGrade: { $avg: '$percentage' } } }
      ]);

      return NextResponse.json({
        ...classData.toObject(),
        stats: {
          studentCount,
          assignmentCount,
          attendanceToday,
          attendanceRate: studentCount > 0 ? (attendanceToday / studentCount) * 100 : 0,
          recentBehaviors,
          averageGrade: averageGrade.length > 0 ? averageGrade[0].avgGrade : 0
        }
      });
    }

    return NextResponse.json(classData);
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    // Check if class exists and belongs to teacher
    const existingClass = await Class.findOne({
      _id: id,
      teacher: session.user.id,
    });

    if (!existingClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Check if class code is unique (if being updated)
    if (body.classCode && body.classCode !== existingClass.classCode) {
      const duplicateClass = await Class.findOne({ 
        classCode: body.classCode,
        _id: { $ne: id }
      });
      if (duplicateClass) {
        return NextResponse.json({ 
          error: 'Class code already exists' 
        }, { status: 400 });
      }
    }

    const updatedClass = await Class.findOneAndUpdate(
      { _id: id, teacher: session.user.id },
      { ...body, updatedAt: new Date() },
      { new: true }
    ).populate('students', 'name seatNumber avatar')
     .populate('teacher', 'name email');

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Check if class exists and belongs to teacher
    const existingClass = await Class.findOne({
      _id: id,
      teacher: session.user.id,
    });

    if (!existingClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Check if class has students
    const studentCount = await Student.countDocuments({ 
      class: id, 
      isActive: true 
    });

    if (studentCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete class with active students. Please remove all students first.' 
      }, { status: 400 });
    }

    // Soft delete - mark as archived instead of hard delete
    const deletedClass = await Class.findOneAndUpdate(
      { _id: id, teacher: session.user.id },
      { status: 'archived', updatedAt: new Date() },
      { new: true }
    );

    return NextResponse.json({ 
      message: 'Class archived successfully',
      class: deletedClass
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
